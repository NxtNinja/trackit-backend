const AppError = require("../utils/AppError");

/**
 * Middleware to verify that the request originated from the API Gateway.
 * It checks for a shared secret key in the x-internal-service-key header.
 */
const serviceAuth = (req, res, next) => {
  const serviceKey = req.headers["x-internal-service-key"];
  const expectedKey = process.env.INTERNAL_SERVICE_KEY

  if (!serviceKey || serviceKey !== expectedKey) {
    console.warn(`[SECURITY WARNING] Unauthorized direct service access attempt from IP: ${req.ip}`);
    return next(new AppError("Unauthorized service access", 401));
  }

  next();
};

module.exports = serviceAuth;
