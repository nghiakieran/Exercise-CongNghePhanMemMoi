import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Product Service
export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    try {
      const query = new URLSearchParams();

      if (params.page) query.append("page", params.page);
      if (params.limit) query.append("limit", params.limit);
      if (params.search) query.append("search", params.search);
      if (params.categoryId) query.append("categoryId", params.categoryId);
      if (params.minPrice) query.append("minPrice", params.minPrice);
      if (params.maxPrice) query.append("maxPrice", params.maxPrice);

      const response = await axios.get(`${API_BASE_URL}/products?${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create product (Admin only)
  createProduct: async (productData, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update product (Admin only)
  updateProduct: async (id, productData, token) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Category Service
export const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single category
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default { productService, categoryService };
