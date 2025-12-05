import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productService, categoryService } from "../services/productService";
import authService from "../services/authService";
import { ADD_TO_CART } from "../graphql/cartQueries";
import { graphQLRequest } from "../graphql/graphQLClient";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [similarFor, setSimilarFor] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
  });

  const observerTarget = useRef(null);
  const navigate = useNavigate();

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Load products
  const loadProducts = useCallback(
    async (resetList = false) => {
      if (loading) return;

      try {
        setLoading(true);
        const response = await productService.getProducts(filters);

        if (resetList) {
          setProducts(response.data || []);
        } else {
          setProducts((prev) => [...prev, ...(response.data || [])]);
        }

        setHasMore(response.pagination?.hasMore || false);
      } catch (error) {
        console.error("Failed to load products:", error);
        // Nếu lỗi (vd: rate limit), dừng infinite scroll để tránh spam request
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [filters, loading]
  );

  // Initial load and when filters change
  useEffect(() => {
    setProducts([]);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [filters.search, filters.categoryId, filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    loadProducts(filters.page === 1);
  }, [filters]);

  // Infinite scroll using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  // Load favorites for logged-in user (once on mount)
  useEffect(() => {
    const loadFavorites = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return;
      try {
        const token = localStorage.getItem("token");
        const response = await productService.getFavorites(token);
        const ids = new Set((response.data || []).map((p) => p.id));
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (productId) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      alert("Vui lòng đăng nhập để sử dụng danh sách yêu thích");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (favoriteIds.has(productId)) {
        await productService.removeFavorite(productId, token);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await productService.addFavorite(productId, token);
        setFavoriteIds((prev) => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, categoryId: e.target.value, page: 1 }));
  };

  const handlePriceFilter = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const loadSimilar = async (productId) => {
    try {
      const response = await productService.getSimilarProducts(productId);
      setSimilarFor(productId);
      setSimilarProducts(response.data || []);
    } catch (error) {
      console.error("Failed to load similar products:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      // Đảm bảo price là number, không phải string
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : Number(product.price);
      
      await graphQLRequest(ADD_TO_CART, {
        input: {
          productId: String(product.id), // Đảm bảo là string
          name: product.name,
          price: price, // Number, không phải string
          quantity: 1,
          imageUrl: product.imageUrl || null,
        },
      });
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleViewProduct = (product) => {
    // Chuẩn hóa dữ liệu trước khi lưu (tránh object phức tạp)
    const viewed = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category
        ? { id: product.category.id, name: product.category.name }
        : null,
    };

    // Cập nhật danh sách đã xem gần đây (FE + localStorage)
    setRecentlyViewed((prev) => {
      const existing = prev.filter((p) => p.id !== viewed.id);
      const updated = [viewed, ...existing].slice(0, 8);
      try {
        localStorage.setItem(
          "recentlyViewedProducts",
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error("Failed to save recently viewed products:", e);
      }
      return updated;
    });
    navigate(`/products/${product.id}`);
  };

  // Load from localStorage khi vào trang
  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewedProducts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      } catch (e) {
        console.error("Failed to parse recently viewed products:", e);
      }
    }
  }, []);

  return (
    <div className="product-list-container">
      <header className="shop-header">
        <h1>🛒 UTE Shop</h1>
        <p>Mua sắm trực tuyến dễ dàng</p>
      </header>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.search}
            onChange={handleSearch}
            className="search-input"
          />

          <select
            value={filters.categoryId}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-row">
          <input
            type="number"
            placeholder="Giá từ"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
            }
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Giá đến"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
            className="price-input"
          />
          <button onClick={handlePriceFilter} className="filter-btn">
            Lọc giá
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length === 0 && !loading ? (
          <div className="empty-state">
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleViewProduct(product)}
            >
              <div className="product-image">
                <img
                  src={product.imageUrl || "https://via.placeholder.com/300"}
                  alt={product.name}
                  loading="lazy"
                />
                {product.stock < 10 && product.stock > 0 && (
                  <span className="stock-badge low">
                    Còn {product.stock} sản phẩm
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="stock-badge out">Hết hàng</span>
                )}
                <button
                  type="button"
                  className={`favorite-btn ${
                    favoriteIds.has(product.id) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  {favoriteIds.has(product.id) ? "♥" : "♡"}
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.category && (
                  <span className="category-badge">
                    {product.category.name}
                  </span>
                )}
                <p className="product-description">
                  {product.description?.substring(0, 80)}
                  {product.description?.length > 80 && "..."}
                </p>
                <div className="product-footer">
                  <div>
                    <p className="product-price">
                      {formatPrice(product.price)}
                    </p>
                    <p className="product-stats">
                      {product.buyersCount || 0} người mua ·{" "}
                      {product.commentsCount || 0} bình luận
                    </p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="add-to-cart-btn"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <span>🛒</span> Thêm giỏ hàng
                    </button>
                    <button
                      type="button"
                      className="similar-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        loadSimilar(product.id);
                      }}
                    >
                      Sản phẩm tương tự
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Similar products section */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h2>Sản phẩm tương tự</h2>
          <div className="products-grid">
            {similarProducts.map((sp) => (
              <div key={sp.id} className="product-card">
                <div className="product-image">
                  <img
                    src={sp.imageUrl || "https://via.placeholder.com/300"}
                    alt={sp.name}
                    loading="lazy"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{sp.name}</h3>
                  {sp.category && (
                    <span className="category-badge">{sp.category.name}</span>
                  )}
                  <p className="product-price">{formatPrice(sp.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently viewed section */}
      {recentlyViewed.length > 0 && (
        <div className="recently-viewed-section">
          <h2>Sản phẩm đã xem gần đây</h2>
          <div className="products-grid">
            {recentlyViewed.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-image">
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/300"}
                    alt={p.name}
                    loading="lazy"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  {p.category && (
                    <span className="category-badge">{p.category.name}</span>
                  )}
                  <p className="product-price">{formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      )}

      {/* Intersection Observer target */}
      <div ref={observerTarget} className="observer-target"></div>

    </div>
  );
};

export default ProductList;
