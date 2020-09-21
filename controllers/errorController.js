const AppError = require('./../utils/appError');

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Cannot allow duplicate entries in db. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  // 1) If the error is from one of the packages, make it operational using AppError class
  res.status(err.statusCode).json({
    name: err.name,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      name: err.name,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
    // Programming or other unknown error: don't leak error details probably produced by node Environment
  } else {
    // 1) Log error if it's not operational for debugging
    console.error('ERROR 💥💥💥💥💥', err);

    // 2) Send generic message to client
    res.status(500).json({
      status: 'error',
      message: 'Opps,Something went very wrong!',
    });
  }
};
const sendErrorTest = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Fatal error';

  if (process.env.NODE_ENV === 'development') {
    let error = { ...err }; // do not overide the err. Destructure into new var
    error.message = err.message; // the destructuring does not include the message. Include it here

    if (error.name === 'SequelizeUniqueConstraintError') error = handleValidationErrorDB(error);

    //send dev error and log to console for developer to debug if its a module specific error
    if (error.name !== 'EMERGENCY ALERT MIDDLWARE API ERROR')
      console.error('MODULE ERROR - make operational 💥💥💥💥💥', err.stack);
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; // do not overide the err. Destructure into new var
    error.message = err.message; // the destructuring does not include the message. Include it here

    if (error.name === 'SequelizeUniqueConstraintError') error = handleValidationErrorDB(error);
    //Send prod error to client to enable them know what mistake they made from their request
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === 'test') {
    //Send test error to developer
    sendErrorTest(err, res);
  }
};
