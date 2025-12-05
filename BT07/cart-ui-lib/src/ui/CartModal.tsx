import React from "react";
import { CartButton } from "./CartButton";

export type CartModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const CartModal: React.FC<CartModalProps> = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
        {title && (
          <h2 className="text-lg font-semibold mb-2 border-b pb-2">{title}</h2>
        )}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          <CartButton variant="secondary" onClick={onClose}>
            {cancelText}
          </CartButton>
          {onConfirm && (
            <CartButton variant="primary" onClick={onConfirm}>
              {confirmText}
            </CartButton>
          )}
        </div>
      </div>
    </div>
  );
};


