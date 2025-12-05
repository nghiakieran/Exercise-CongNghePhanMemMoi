import React from "react";
import { useCart } from "./CartProvider";
import { CartButton } from "../ui/CartButton";
import { CartCard } from "../ui/CartCard";
import { CartInput } from "../ui/CartInput";

export type CartItemListProps = {
  emptyText?: string;
};

export const CartItemList: React.FC<CartItemListProps> = ({
  emptyText = "Giỏ hàng trống",
}) => {
  const { state, dispatch } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-lg">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state.items.map((item) => (
        <CartCard
          key={item.id}
          className={`p-5 transition-all duration-200 rounded-xl ${
            item.selected
              ? "border-2 border-blue-500 bg-blue-50 shadow-lg"
              : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Checkbox */}
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={!!item.selected}
                onChange={() =>
                  dispatch({
                    type: "TOGGLE_SELECT",
                    payload: { id: item.id },
                  })
                }
                className="w-5 h-5 cursor-pointer accent-blue-600"
              />
            </div>

            {/* Image */}
            <div className="flex-shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-xl object-cover shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div
                className={`w-28 h-28 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md ${
                  item.imageUrl ? "hidden" : ""
                }`}
              >
                <span className="text-gray-400 text-3xl">📦</span>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2 line-clamp-2">
                {item.name}
              </h3>
              <div className="text-sm text-gray-600 mb-4">
                Giá:{" "}
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </span>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit">
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      dispatch({
                        type: "UPDATE",
                        payload: { id: item.id, quantity: item.quantity - 1 },
                      });
                    }
                  }}
                  disabled={item.quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-gray-700 shadow-sm"
                  title="Giảm số lượng"
                >
                  −
                </button>
                <CartInput
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const qty = Math.max(1, Number(e.target.value) || 1);
                    dispatch({
                      type: "UPDATE",
                      payload: { id: item.id, quantity: qty },
                    });
                  }}
                  className="w-16 text-center font-medium bg-white border-gray-200"
                />
                <button
                  onClick={() => {
                    dispatch({
                      type: "UPDATE",
                      payload: { id: item.id, quantity: item.quantity + 1 },
                    });
                  }}
                  className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                  title="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total price & Actions */}
            <div className="flex-shrink-0 text-right flex flex-col items-end gap-4">
              <div className="text-xl md:text-2xl font-bold text-red-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price * item.quantity)}
              </div>
              <CartButton
                variant="danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"
                    )
                  ) {
                    dispatch({ type: "REMOVE", payload: { id: item.id } });
                  }
                }}
                className="text-sm py-2 px-4"
              >
                🗑️ Xóa
              </CartButton>
            </div>
          </div>
        </CartCard>
      ))}
    </div>
  );
};
