const Product = require("../models/Product");
const Category = require("../models/Category");
const { Op } = require("sequelize");
const searchService = require("../services/searchService");

// Lấy danh sách sản phẩm theo search/filter (có Elasticsearch)
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    try {
      const elasticResults = await searchService.search({
        keyword: req.query.search,
        categoryId: req.query.categoryId,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        hasDiscount: req.query.hasDiscount,
        minViews: req.query.minViews,
        sort: req.query.sort,
        limit,
        offset,
      });

      const productIds = elasticResults.map((result) => result.id);

      if (productIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Products fetched successfully",
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false,
          },
        });
      }

      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: productIds,
          },
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
      });

      const orderedProducts = productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p) => p !== undefined);

      const totalResults = await searchService.count({
        keyword: req.query.search,
        categoryId: req.query.categoryId,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        hasDiscount: req.query.hasDiscount,
        minViews: req.query.minViews,
      });

      const totalPages = Math.ceil(totalResults / limit);
      const hasMore = page < totalPages;

      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: orderedProducts,
        pagination: {
          page,
          limit,
          total: totalResults,
          totalPages,
          hasMore,
        },
      });
    } catch (error) {
      console.error("Elasticsearch search failed:", error.message);
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasMore: false,
        },
      });
    }
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Sản phẩm tương tự theo category (và loại trừ chính nó)
const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { categoryId, price } = product;

    const where = {
      categoryId,
      id: { [Op.ne]: product.id },
    };

    // Có thể thêm filter khoảng giá gần gần sản phẩm gốc nếu muốn
    if (price) {
      where.price = {
        [Op.between]: [price * 0.5, price * 1.5],
      };
    }

    const similarProducts = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      limit: 8,
    });

    res.status(200).json({
      success: true,
      message: "Similar products fetched successfully",
      data: similarProducts,
    });
  } catch (error) {
    console.error("Get similar products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
    });

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: createdProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.categoryId) {
      const category = await Category.findByPk(req.body.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    await product.update(req.body);

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
};
