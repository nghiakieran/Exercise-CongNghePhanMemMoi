import { useState, useEffect, useCallback, useRef } from "react";
import { productService, categoryService } from "../services/productService";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
  });

  const observerTarget = useRef(null);

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
            <div key={product.id} className="product-card">
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
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <button className="add-to-cart-btn">
                    <span>🛒</span> Thêm giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      )}

      {/* Intersection Observer target */}
      <div ref={observerTarget} className="observer-target"></div>

      {/* End message */}
      {!hasMore && products.length > 0 && (
        <div className="end-message">
          <p>✅ Đã hiển thị tất cả {products.length} sản phẩm</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
