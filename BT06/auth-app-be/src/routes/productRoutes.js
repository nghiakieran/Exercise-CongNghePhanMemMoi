const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { getCommentsByProduct, addComment } = require("../controllers/commentController");
const { createPurchase } = require("../controllers/purchaseController");
const { requireAdmin } = require("../middleware/authorization");
const {
  createProductValidation,
  updateProductValidation,
  paginationValidation,
} = require("../middleware/validation");

// Public routes
router.get("/", paginationValidation, getProducts);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id", getProductById);
router.get("/:id/comments", getCommentsByProduct);

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

// User routes
router.post("/:id/comments", protect, addComment);
router.post("/:id/purchase", protect, createPurchase);

module.exports = router;
