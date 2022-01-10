const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: [true, 'firstName is required'],
    },
    lastName: {
      type: String,
      // required: [true, 'lastName is required'],
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      // unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    emailForReports:{
      type:String
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['super-admin', 'admin', 'user', 'guest'],
      default: 'guest',
    },
    password: {
      type: String,
      // required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    phoneNumber:{
      type:Number,
      minlength:10,
    },
    provider:{
      type:String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: false,
      select: false,
    },
    parentId:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

// ===================================================================================

// // To encrypt the password
// userSchema.pre('save', async function (next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost 12
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete the confirmed password.
//   this.passwordConfirm = undefined;
//   next();
// });

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

// ============ SCHEMA METHODS =======================

// To match the user password during login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return (candidatePassword === userPassword);
};

//If the user has changed the password.

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10

    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

// Generating a password reset token Method

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() +  10* 60 * 1000;
  return resetToken;
};

// ======================================

/// Creating User Model

const User = mongoose.model('User', userSchema);

//exporting user model

module.exports = User;
