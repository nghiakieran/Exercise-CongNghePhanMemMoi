import React from "react";
import { useCart } from "./CartProvider";
import { CartButton } from "../ui/CartButton";

export type CartSummaryProps = {
  onCheckout?: (selectedIds: string[]) => void;
};

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { state } = useCart();
  const selectedItems = state.items.filter((i) => i.selected);
  const total = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  const selectedIds = selectedItems.map((i) => i.id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Số lượng sản phẩm:</span>
        <strong className="text-gray-900">{totalItems}</strong>
      </div>
      <div className="flex justify-between items-center text-base">
        <span className="font-medium">Tổng cộng:</span>
        <strong className="text-xl text-red-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(total)}
        </strong>
      </div>
      <CartButton
        variant="primary"
        disabled={selectedIds.length === 0}
        onClick={() => onCheckout && onCheckout(selectedIds)}
        className="w-full !py-3 !text-base !font-semibold"
      >
        {selectedIds.length > 0
          ? `Thanh toán (${selectedIds.length} sản phẩm)`
          : "Vui lòng chọn sản phẩm"}
      </CartButton>
    </div>
  );
};
