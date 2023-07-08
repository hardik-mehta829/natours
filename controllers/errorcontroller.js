const apperror = require('./../utils/apperror');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new apperror(message, 400);
};
const handleDuplicateField = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value ${value} .Please use another value`;
  return new apperror(message, 400);
};
const handleInvalidInputDB = (err) => {
  const infos = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${infos.join('. ')}`;
  return new apperror(message, 400);
};
const handleJsonWebtoken = (err) => {
  return new apperror('Invalid token', 401);
};
const handleExpiredToken = (err) => {
  return new apperror('Token is already expired.Please log in again', 401);
};
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statuscode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    return res.status(err.statuscode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statuscode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //Unexpected,unknown errors
      // console.log('ERROR 🎆', err);
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else {
    if (err.isOperational) {
      return res.status(err.statuscode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    } else {
      //Unexpected,unknown errors
      // console.log('ERROR 🎆', err);
      return res.status(err.statuscode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV.trim() === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
      sendErrorProd(err, req, res);
    }
    if (err.code === 11000) {
      err = handleDuplicateField(err);
      sendErrorProd(err, req, res);
    }
    if (err.name === 'ValidationError') {
      err = handleInvalidInputDB(err);
      sendErrorProd(err, req, res);
    }
    if (err.name === 'JsonWebTokenError') {
      err = handleJsonWebtoken(err);
      sendErrorProd(err, req, res);
    }
    if (err.name === 'TokenExpiredError') {
      err = handleExpiredToken(err);
      sendErrorProd(err, req, res);
    }
    sendErrorProd(err, req, res);
  }
};
