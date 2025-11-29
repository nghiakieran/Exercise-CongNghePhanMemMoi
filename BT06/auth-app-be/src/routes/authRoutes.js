const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  logout,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validation");
const { authLimiter, loginLimiter } = require("../middleware/rateLimiter");
const { body } = require("express-validator");

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Routes với rate limiting
router.post("/register", authLimiter, registerValidation, register);
router.post("/login", loginLimiter, loginValidation, login);
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidation,
  forgotPassword
);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
