const Purchase = require("../models/Purchase");
const Product = require("../models/Product");

// @desc    Create a purchase (simulate buying a product)
// @route   POST /api/products/:id/purchase
// @access  Private
const createPurchase = async (req, res) => {
  try {
    const productId = req.params.id;
    const { qty = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if this user has purchased before
    const existing = await Purchase.findOne({
      where: { userId: req.user.id, productId },
    });

    await Purchase.create({
      userId: req.user.id,
      productId,
      qty,
    });

    // If first time, increase buyersCount
    if (!existing) {
      product.buyersCount = (product.buyersCount || 0) + 1;
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "Purchase recorded successfully",
    });
  } catch (error) {
    console.error("Create purchase error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record purchase",
      error: error.message,
    });
  }
};

module.exports = {
  createPurchase,
};


