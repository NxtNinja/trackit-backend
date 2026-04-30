const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const validate = require("../middleware/validate.middleware");
const { signupSchema, loginSchema, updateProfileSchema, updatePasswordSchema } = require("../utils/validation");

const authController = require("../controllers/auth.controller");

// Strict rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP or Email to 5 login requests per window
  message: { success: false, message: "Too many login attempts. Please try again after 15 minutes." },
  keyGenerator: (req) => {
    return req.body.email ? req.body.email.toLowerCase() : req.ip;
  }
});

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), loginLimiter, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/me", authController.getCurrentUser);
router.put("/profile", validate(updateProfileSchema), authController.updateProfile);
router.put("/password", validate(updatePasswordSchema), authController.updatePassword);

module.exports = router;
