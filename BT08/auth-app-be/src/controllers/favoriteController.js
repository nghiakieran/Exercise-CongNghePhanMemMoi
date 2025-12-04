const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

// @desc    Get current user's favorite products
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: favorites.map((fav) => fav.product),
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

// @desc    Add product to favorites
// @route   POST /api/favorites/:productId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    await Favorite.findOrCreate({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product added to favorites",
    });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add favorite",
      error: error.message,
    });
  }
};

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    await Favorite.destroy({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product removed from favorites",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove favorite",
      error: error.message,
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
