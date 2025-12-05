import { useEffect, useState } from "react";
import {
  GET_CART,
  CHECKOUT,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  TOGGLE_SELECT,
} from "../graphql/cartQueries";
import {
  CartProvider,
  CartSummary,
  useCart,
} from "@nghiaute/cart-ui-lib";
import { CartItemListWrapper } from "../components/CartItemListWrapper";
import { graphQLRequest } from "../graphql/graphQLClient";
import { productService } from "../services/productService";
import authService from "../services/authService";
import "./Cart.css";

const CartBody = () => {
  const { state, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Sync dữ liệu cart từ GraphQL vào context UI
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const res = await graphQLRequest(GET_CART);
        const cart = res?.data?.cart || [];
        dispatch({ type: "CLEAR" });
        cart.forEach((item) =>
          dispatch({
            type: "ADD",
            payload: {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              selected: item.selected || false,
              imageUrl: item.imageUrl,
              productId: item.productId, // Lưu productId để dùng khi checkout
            },
          })
        );
      } catch (err) {
        console.error("Load cart failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [dispatch]);

  // CartItemListWrapper sẽ tự sync các thay đổi lên GraphQL

  const handleSelectAll = async () => {
    const allSelected = state.items.every((i) => i.selected);
    const ids = state.items.map((i) => i.id);
    
    // Update local state
    dispatch({
      type: "SELECT_MANY",
      payload: { ids, selected: !allSelected },
    });

    // Sync to GraphQL
    setSyncing(true);
    try {
      await Promise.all(
        ids.map((id) => {
          const item = state.items.find((i) => i.id === id);
          if (item && item.selected !== !allSelected) {
            return graphQLRequest(TOGGLE_SELECT, { id });
          }
          return Promise.resolve();
        })
      );
    } catch (err) {
      console.error("Toggle select all failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleCheckout = async (selectedIds) => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thanh toán!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thanh toán!");
      return;
    }

    setSyncing(true);
    try {
      // Lấy thông tin các sản phẩm đã chọn
      const selectedItems = state.items.filter((item) =>
        selectedIds.includes(item.id)
      );

      // Gọi API purchase cho từng sản phẩm để tăng buyersCount
      const purchasePromises = selectedItems.map((item) => {
        // Lấy productId từ item (có thể là string hoặc number)
        const productId = (item.productId || item.id);
        const productIdNum = typeof productId === 'string' 
          ? parseInt(productId) 
          : productId;
        
        if (!productIdNum || isNaN(productIdNum)) {
          console.warn(`Invalid productId for item ${item.id}:`, productId);
          return Promise.resolve();
        }
        
        return productService.purchaseProduct(
          productIdNum,
          item.quantity,
          token
        ).catch((err) => {
          console.error(`Failed to purchase product ${productIdNum}:`, err);
          // Không throw để các sản phẩm khác vẫn có thể được xử lý
        });
      });

      await Promise.all(purchasePromises);

      // Gọi GraphQL checkout
      await graphQLRequest(CHECKOUT, { ids: selectedIds });

      alert("Thanh toán thành công!");
      
      // Xóa các item đã thanh toán
      selectedIds.forEach((id) => {
        dispatch({ type: "REMOVE", payload: { id } });
        graphQLRequest(REMOVE_CART_ITEM, { id }).catch(console.error);
      });
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Thanh toán thất bại!");
    } finally {
      setSyncing(false);
    }
  };

  const handleRemoveSelected = async () => {
    const selected = state.items.filter((i) => i.selected);
    if (selected.length === 0) {
      alert("Vui lòng chọn sản phẩm để xóa!");
      return;
    }
    if (
      !confirm(
        `Bạn có chắc muốn xóa ${selected.length} sản phẩm đã chọn?`
      )
    ) {
      return;
    }

    setSyncing(true);
    try {
      await Promise.all(
        selected.map((item) => graphQLRequest(REMOVE_CART_ITEM, { id: item.id }))
      );
      selected.forEach((item) => {
        dispatch({ type: "REMOVE", payload: { id: item.id } });
      });
    } catch (err) {
      console.error("Remove selected failed:", err);
      alert("Xóa sản phẩm thất bại!");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">
          <div className="spinner"></div>
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <a href="/products" className="btn-primary">
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    );
  }

  const selectedItems = state.items.filter((i) => i.selected);
  const total = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Giỏ hàng của tôi</h1>
        <span className="cart-count">{state.items.length} sản phẩm</span>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-actions-top">
            <label className="select-all-checkbox">
              <input
                type="checkbox"
                checked={
                  state.items.length > 0 &&
                  state.items.every((i) => i.selected)
                }
                onChange={handleSelectAll}
                disabled={syncing}
              />
              <span>Chọn tất cả</span>
            </label>
            <button
              className="btn-remove-selected"
              onClick={handleRemoveSelected}
              disabled={syncing || selectedItems.length === 0}
            >
              Xóa đã chọn
            </button>
          </div>

          {/* Sử dụng CartItemList từ thư viện (qua wrapper để sync GraphQL) */}
          <div className="cart-items-wrapper">
            <CartItemListWrapper emptyText="Giỏ hàng trống" />
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="summary-row">
              <span>Số lượng sản phẩm:</span>
              <strong>{totalItems}</strong>
            </div>
            <div className="summary-row">
              <span>Tạm tính:</span>
              <strong>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(total)}
              </strong>
            </div>
            <div className="summary-row summary-total">
              <span>Tổng cộng:</span>
              <strong className="total-price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(total)}
              </strong>
            </div>
            
            {/* Sử dụng CartSummary từ thư viện */}
            <div className="cart-summary-wrapper">
              <CartSummary onCheckout={handleCheckout} />
            </div>
            
            <a href="/products" className="btn-continue-shopping">
              ← Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => (
  <CartProvider>
    <CartBody />
  </CartProvider>
);

export default CartPage;
