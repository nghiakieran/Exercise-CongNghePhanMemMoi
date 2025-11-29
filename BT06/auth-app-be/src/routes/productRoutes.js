const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/authorization");
const {
  createProductValidation,
  updateProductValidation,
  paginationValidation,
} = require("../middleware/validation");

// Public routes
router.get("/", paginationValidation, getProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", protect, requireAdmin, createProductValidation, createProduct);
router.put(
  "/:id",
  protect,
  requireAdmin,
  updateProductValidation,
  updateProduct
);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;
