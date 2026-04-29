const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate.middleware");
const { signupSchema, loginSchema } = require("../utils/validation");
const authMiddleware = require("../middleware/auth.middleware");

const authController = require("../controllers/auth.controller");

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/me", authController.getCurrentUser);

module.exports = router;
