const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  console.log('xxx');
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/"(.*)"/)[0];
  const message = `Duplicate field value: ${value}, please use another value.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token, please login again!', 401);
};
const handleJWTExpiredError = () => {
  return new AppError('The token has been expired. Please log in again!', 401);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) Rendered Website
  console.error('ERROR💩', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong...',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // a1) Oprational, trusted error: send error message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // a2)Progamming, unexpected error: don't leak error details
    // 1) log error
    console.error('ERROR💩', err);
    // 2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) Rendered Website
  // b1) Oprational, trusted error: send error message to client
  if (err.isOperational) {
    console.error('ERROR💩', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong...',
      msg: err.message,
    });
  }

  // b2) Progamming, unexpected error: don't leak error details
  // 1) log error
  console.error('ERROR💩', err);
  // 2) send generic message
  return res.status(500).render('error', {
    title: 'Something went wrong...',
    msg: 'Please try again later!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err instanceof mongoose.Error.CastError)
      error = handleCastErrorDB(error);

    if (err.code === 11000) error = handleDuplicateFieldsDB(error);

    if (err instanceof mongoose.Error.ValidationError)
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
