const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });

  return newObject;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateCurrentUserData = catchAsync(async (req, res, next) => {
  // Create error if user post passwords data.
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Can not update password. Only data can be updated', 400)
    );
  }

  // Filter out the fields that are not allowed to be updated
  const filterBody = filterObj(req.body, 'name', 'email');

  //Update user Document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'Success',
    data: {
      updateUser,
    },
  });
});

exports.createUser = (req, res, next) => {};

exports.getUser = (req, res, next) => {};

exports.updateUser = (req, res, next) => {};

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
