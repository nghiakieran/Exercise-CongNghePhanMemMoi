const Comment = require("../models/Comment");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Get comments for a product
// @route   GET /api/products/:id/comments
// @access  Public
const getCommentsByProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const comments = await Comment.findAll({
      where: { productId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// @desc    Add comment for a product
// @route   POST /api/products/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const productId = req.params.id;
    const { content, rating } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    await Comment.create({
      userId: req.user.id,
      productId,
      content,
      rating: rating || null,
    });

    // Increase commentsCount
    product.commentsCount = (product.commentsCount || 0) + 1;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

module.exports = {
  getCommentsByProduct,
  addComment,
};


