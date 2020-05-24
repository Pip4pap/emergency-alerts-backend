const AppError = require("./../utils/appError");
const sendErrorDev = (err, res) => {
  // 1) Always Log error in developement for debugging
  // 2) If the error is from one of the packages, make it operational using AppError class
  console.error("ERROR 💥💥💥💥💥", err.stack);
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
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details probably produced by node Environment
  } else {
    // 1) Log error if it's not operational for debugging
    console.error("ERROR 💥💥💥💥💥", err);

    // 2) Send generic message to client
    res.status(500).json({
      status: "error",
      message: "Opps,Something went very wrong!",
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
  err.status = err.status || "Fatal error";
  if (process.env.NODE_ENV === "development") {
    //send dev error and log to console for developer to debug
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    //Send prod error to client to enable them know what mistake they made from their request
    sendErrorProd(err, res);
  } else if (process.env.NODE_ENV === "test") {
    //Send test error to developer
    sendErrorTest(err, res);
  }
};
