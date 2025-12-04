const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

// All routes require authentication
router.get("/", protect, getFavorites);
router.post("/:productId", protect, addFavorite);
router.delete("/:productId", protect, removeFavorite);

module.exports = router;
