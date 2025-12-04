const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/authorization");
const { createCategoryValidation } = require("../middleware/validation");

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post(
  "/",
  protect,
  requireAdmin,
  createCategoryValidation,
  createCategory
);
router.put("/:id", protect, requireAdmin, updateCategory);
router.delete("/:id", protect, requireAdmin, deleteCategory);

module.exports = router;
