import React from 'react';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    selected?: boolean;
};
type CartState = {
    items: CartItem[];
};
type Action = {
    type: "ADD";
    payload: CartItem;
} | {
    type: "UPDATE";
    payload: {
        id: string;
        quantity: number;
    };
} | {
    type: "REMOVE";
    payload: {
        id: string;
    };
} | {
    type: "TOGGLE_SELECT";
    payload: {
        id: string;
    };
} | {
    type: "SELECT_MANY";
    payload: {
        ids: string[];
        selected: boolean;
    };
} | {
    type: "CLEAR";
};
declare const CartProvider: React.FC<{
    children: React.ReactNode;
}>;
declare function useCart(): {
    state: CartState;
    dispatch: React.Dispatch<Action>;
};

type CartItemListProps = {
    emptyText?: string;
};
declare const CartItemList: React.FC<CartItemListProps>;

type CartSummaryProps = {
    onCheckout?: (selectedIds: string[]) => void;
};
declare const CartSummary: React.FC<CartSummaryProps>;

type CartButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
};
declare const CartButton: React.FC<CartButtonProps>;

type CartInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};
declare const CartInput: React.FC<CartInputProps>;

type CartCardProps = {
    children: React.ReactNode;
    className?: string;
};
declare const CartCard: React.FC<CartCardProps>;

type CartModalProps = {
    open: boolean;
    title?: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
};
declare const CartModal: React.FC<CartModalProps>;

export { CartButton, type CartButtonProps, CartCard, type CartCardProps, CartInput, type CartInputProps, type CartItem, CartItemList, type CartItemListProps, CartModal, type CartModalProps, CartProvider, CartSummary, type CartSummaryProps, useCart };
