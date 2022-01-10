const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, profile, statusCode, res) => {
    const token = signToken(user._id);

    // Storing token in cookie
    const CookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        //secure: true,
        httpOnly: true,
    };

    res.cookie('jwt', token, CookieOptions);

    // Remove the password from the output
    user.password = undefined;

    // Sending response
    res.status(statusCode).json({
        status: 'Success',
        token,
        data: {
            user,
            profile
        },
    });
};

//USER Signup
exports.signup = catchAsync(async(req, res, next) => {
    try {
        const user = await User.create(req.body.user);
        req.body.profile['userId'] = user._id;
        await Profile.create(req.body.profile);
        //3) Send it to user's email
        const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/verifyUser/${signToken(user._id)}`;
        const message = `Please verify your email :${resetUrl}. \n
   If you already have, please ignore this email!`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification for Unicodezinventory Account',
                message,
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email',
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new AppError('Error sending email', 500));
        }
    } catch (err) {
        return next(
            new AppError('User already exist', 404)
        );
    }
});

//Email Verification
exports.signUpVerification = catchAsync(async(req, res, next) => {
    // 1) Get the token and check if it exist
    if (!req.params.token) {
        return next(
            new AppError('Verification for user,token not provided', 401)
        );
    }

    // 2) Verification of Token
    const decoded = await promisify(jwt.verify)(
        req.params.token,
        process.env.JWT_SECRET_KEY
    );
    const user = await User.findById(decoded.id);
    const result = await User.findByIdAndUpdate(decoded.id, { active: true }, {
        new: true,
        runValidators: true,
    });
    if (!user && !result) {
        return next(
            new AppError('User not found', 404)
        );
    } else
    // 3) if everything is ok, send token to the client.
        createSendToken(user, null, 200, res);
});

//User Login
exports.login = catchAsync(async(req, res, next) => {
    const { email, password, provider, lastName, firstName } = req.body;
    // 1) Check email and password exists.
    if (!email) {
        return next(new AppError('Please provide email and password', 400));
    }
    let user;
    if (password) {
        user = await User.findOne({ email }).select('+password');
        if (!user.password) {
            return next(new AppError('Please login using Google or SignUp', 401));
        }
        if (password && (!user || !(await user.correctPassword(CryptoJS.AES.decrypt(password.trim(), process.env.CRYPTO_ENCRY).toString(CryptoJS.enc.Utf8), CryptoJS.AES.decrypt(user.password.trim(), process.env.CRYPTO_ENCRY).toString(CryptoJS.enc.Utf8))))) {
            return next(new AppError('Incorrect email or password', 401));
        }

    } else {
        if (provider) {
            user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    "email": email,
                    "firstName": firstName,
                    "lastName": lastName,
                    "provider": provider
                });
                await Profile.create({ "userId": user._id });
            } else {
                user = await User.findByIdAndUpdate(user._id, { "provider": provider })
            }
        }
    }
    // 3) if everything is ok, send token to the client.
    createSendToken(user, null, 200, res);
});

// ==============================================
// Implementing Route protection

exports.protect = catchAsync(async(req, res, next) => {
    if (process.env.AUTH_ENABLED) {
        let token;
        // 1) Get the token and check if it exist
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(
                new AppError('You are Not logged in! Please login to get access', 401)
            );
        }

        // 2) Verification of Token
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET_KEY
        );
        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(
                new AppError('The User belongs to this token does not exist', 401)
            );
        }

        // 4) Check if User changed Password after the JWT token was issued

        if (currentUser.changePasswordAfter(decoded.iat)) {
            return next(
                new AppError(
                    'User recently changed password. Please try again with new password',
                    401
                )
            );
        }
        //Grant access to Protected Route
        req.user = currentUser;
    }
    next();
});

// Function to provide Role Based access.

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array
        if (process.env.AUTH_ENABLED === true) {
            if (!roles.includes(req.user.role)) {
                return next(
                    new AppError('You do not have permission to perform this action!', 403)
                );
            }
        }
        next();
    };
};

// Forgot Password handler

exports.forgotPassword = catchAsync(async(req, res, next) => {
    //1) Get user based on provided email address
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('No user exist with this email address!', 404));
    }
    //2) Generate a random User token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3) Send it to user's email
    const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? submit a PUT request with your new password and password Confirm to :${resetUrl}. \n If you did not forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: ' your password reset token (10 min validity)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Error sending email', 500));
    }
});

// Reset password Handler
exports.resetPassword = catchAsync(async(req, res, next) => {
    //Get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    //if token has not expired, and there is user, set the new password

    if (!user) {
        return next(new AppError('Token is invalid or expired'), 400)();
    }

    await User.findByIdAndUpdate(user._id, { password: req.body.password });
    // update changePasswordAt property for the user

    // log the user in, send jwt
    createSendToken(user, null, 201, res);
});

// Updating the current logged in User password

exports.updatePassword = catchAsync(async(req, res, next) => {
    // Get the current user from the collection
    const user = await User.findById(req.body.id).select('+password');

    await User.findByIdAndUpdate(user._id, { password: req.body.password });
    // update changePasswordAt property for the user

    //log the user in, Send jwt.
    createSendToken(user, null, 201, res);
});