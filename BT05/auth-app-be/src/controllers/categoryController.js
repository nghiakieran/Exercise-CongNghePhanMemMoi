const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
      attributes: ["id", "name", "description", "slug"],
    });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// @desc    Get single category by ID with products
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
          limit: 10,
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    // Check if slug already exists
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this slug already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // If slug is being updated, check if it's unique
    if (req.body.slug && req.body.slug !== category.slug) {
      const existingCategory = await Category.findOne({
        where: { slug: req.body.slug },
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this slug already exists",
        });
      }
    }

    await category.update(req.body);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has products
    const productsCount = await Product.count({
      where: { categoryId: req.params.id },
    });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productsCount} products.`,
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
