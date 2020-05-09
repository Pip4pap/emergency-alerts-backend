class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // 400 code errors are fails, 500 code errors are server errors
    this.status = `{statusCode}`.startsWith("4") ? "fail" : "error";

    //If this is true, it implies that the error was generated from using this class otherwise by the node enviroment
    //We shall test it to send only operational errors to client
    this.isOperational = true;
    // adds a stack property to this object to show where error happened
    Error.captureStackTrace(this, this.constructor); //adds a stack property to this object to show where error happened
  }
}

module.exports = AppError;
