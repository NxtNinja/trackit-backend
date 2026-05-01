const express = require("express");
const router = express.Router();
const { rateLimit } = require("express-rate-limit");

const validate = require("../middleware/validate.middleware");
const { signupSchema, loginSchema, updateProfileSchema, updatePasswordSchema } = require("../utils/validation");

const authController = require("../controllers/auth.controller");

// Strict rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again after 15 minutes." }
});

// Strict rate limiter for signup route
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 accounts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many accounts created from this IP. Please try again after an hour." }
});

router.post("/signup", signupLimiter, validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), loginLimiter, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/me", authController.getCurrentUser);
router.put("/profile", validate(updateProfileSchema), authController.updateProfile);
router.put("/password", validate(updatePasswordSchema), authController.updatePassword);

module.exports = router;
