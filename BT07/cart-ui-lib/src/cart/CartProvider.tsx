import React, { createContext, useContext, useReducer } from "react";

export type CartItem = {
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

type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "UPDATE"; payload: { id: string; quantity: number } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "TOGGLE_SELECT"; payload: { id: string } }
  | { type: "SELECT_MANY"; payload: { ids: string[]; selected: boolean } }
  | { type: "CLEAR" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { ...action.payload, selected: false }],
      };
    }
    case "UPDATE":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "TOGGLE_SELECT":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, selected: !i.selected } : i
        ),
      };
    case "SELECT_MANY":
      return {
        items: state.items.map((i) =>
          action.payload.ids.includes(i.id)
            ? { ...i, selected: action.payload.selected }
            : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
