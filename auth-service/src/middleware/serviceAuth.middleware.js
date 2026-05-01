const AppError = require("../utils/AppError");

/**
 * Middleware to verify that the request originated from the API Gateway.
 * It checks for a shared secret key in the x-internal-service-key header.
 */
const serviceAuth = (req, res, next) => {
  const serviceKey = req.headers["x-internal-service-key"];
  const expectedKey = process.env.INTERNAL_SERVICE_KEY || "fallback_secret_key";

  if (!serviceKey || serviceKey !== expectedKey) {
    console.warn(`[SECURITY WARNING] Unauthorized direct service access attempt from IP: ${req.ip}`);
    // We return 401 because this is an unauthenticated service-to-service call
    return next(new AppError("Unauthorized service access", 401));
  }

  next();
};

module.exports = serviceAuth;
