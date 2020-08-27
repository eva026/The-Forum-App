const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Send token
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Store token into web server
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // Marks the cookie to be used with HTTPS only
    httpOnly: true,
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  // Send data
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Sign up
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
});

// Log in
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));
  // 2. Check if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  // 401 means unauthorized
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid email or password', 401));

  // Send token
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

// User must be logged in
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Check if token is there and get it
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  // 2) Check if the token has been changed or has already expired
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const decodedUser = await User.findById(decoded.id);

  if (!decodedUser) {
    return next(
      new AppError('The user that token belongs to does not exist', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (decodedUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password. Please log in again',
        401
      )
    );
  }

  // 5) Grant access
  req.user = decodedUser;
  res.locals.user = decodedUser;
  next();
});

// Update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Find the user from the collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// Only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Check if the token has been changed or has already expired
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
