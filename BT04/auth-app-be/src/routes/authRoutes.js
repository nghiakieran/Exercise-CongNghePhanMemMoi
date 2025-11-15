const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  register,
  login,
  forgotPassword,
  logout,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Validation rules
const registerValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").optional().trim(),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
