const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  const isOperational = err instanceof AppError;

  if (!isOperational) {
    console.error("[UNHANDLED ERROR]", err);
  }

  const statusCode = err.statusCode || 500;
  const message = isOperational ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
