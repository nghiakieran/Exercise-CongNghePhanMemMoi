const { body, param, query, validationResult } = require("express-validator");

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const registerValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and number"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  validate,
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// Product validation rules
const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Product name must be between 2 and 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("imageUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image URL must be valid"),
  body("categoryId")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a valid integer"),
  validate,
];

const updateProductValidation = [
  param("id").isInt({ min: 1 }).withMessage("Product ID must be valid"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Product name must be between 2 and 255 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("imageUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image URL must be valid"),
  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be valid"),
  validate,
];

// Category validation rules
const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  validate,
];

// Pagination validation
const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createProductValidation,
  updateProductValidation,
  createCategoryValidation,
  paginationValidation,
};
