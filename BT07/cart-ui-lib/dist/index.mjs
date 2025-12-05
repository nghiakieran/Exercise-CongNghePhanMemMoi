// src/cart/CartProvider.tsx
import { createContext, useContext, useReducer } from "react";
import { jsx } from "react/jsx-runtime";
var CartContext = createContext(null);
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map(
            (i) => i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          )
        };
      }
      return {
        items: [...state.items, { ...action.payload, selected: false }]
      };
    }
    case "UPDATE":
      return {
        items: state.items.map(
          (i) => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        )
      };
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "TOGGLE_SELECT":
      return {
        items: state.items.map(
          (i) => i.id === action.payload.id ? { ...i, selected: !i.selected } : i
        )
      };
    case "SELECT_MANY":
      return {
        items: state.items.map(
          (i) => action.payload.ids.includes(i.id) ? { ...i, selected: action.payload.selected } : i
        )
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}
var CartProvider = ({
  children
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return /* @__PURE__ */ jsx(CartContext.Provider, { value: { state, dispatch }, children });
};
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

// src/ui/CartButton.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var CartButton = ({
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const base = "px-6 py-3 rounded-lg font-semibold text-base inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border-0 outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: `${base} !bg-blue-600 !text-white hover:!bg-blue-700 active:!bg-blue-800 shadow-md hover:shadow-lg focus:ring-blue-500 disabled:!bg-gray-400 disabled:!text-white disabled:cursor-not-allowed disabled:shadow-none`,
    secondary: `${base} !bg-gray-100 !text-gray-800 hover:!bg-gray-200 active:!bg-gray-300 shadow-sm hover:shadow-md focus:ring-gray-500 disabled:!bg-gray-200 disabled:!text-gray-400 disabled:cursor-not-allowed disabled:shadow-none`,
    danger: `${base} !bg-red-500 !text-white hover:!bg-red-600 active:!bg-red-700 shadow-md hover:shadow-lg focus:ring-red-500 disabled:!bg-gray-400 disabled:!text-white disabled:cursor-not-allowed disabled:shadow-none`
  };
  const classes = `${variants[variant]} ${className}`.trim();
  return /* @__PURE__ */ jsx2("button", { className: classes, disabled, ...props });
};

// src/ui/CartCard.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var CartCard = ({ children, className }) => {
  return /* @__PURE__ */ jsx3(
    "div",
    {
      className: `rounded-lg bg-white ${className || ""}`,
      children
    }
  );
};

// src/ui/CartInput.tsx
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
var CartInput = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    label && /* @__PURE__ */ jsx4("label", { className: "text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx4(
      "input",
      {
        className: `border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${className}`,
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx4("span", { className: "text-xs text-red-500", children: error })
  ] });
};

// src/cart/CartItemList.tsx
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
var CartItemList = ({
  emptyText = "Gi\u1ECF h\xE0ng tr\u1ED1ng"
}) => {
  const { state, dispatch } = useCart();
  if (state.items.length === 0) {
    return /* @__PURE__ */ jsx5("div", { className: "text-center py-12 text-gray-500 text-lg", children: emptyText });
  }
  return /* @__PURE__ */ jsx5("div", { className: "space-y-4", children: state.items.map((item) => /* @__PURE__ */ jsx5(
    CartCard,
    {
      className: `p-5 transition-all duration-200 rounded-xl ${item.selected ? "border-2 border-blue-500 bg-blue-50 shadow-lg" : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"}`,
      children: /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx5("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx5(
          "input",
          {
            type: "checkbox",
            checked: !!item.selected,
            onChange: () => dispatch({
              type: "TOGGLE_SELECT",
              payload: { id: item.id }
            }),
            className: "w-5 h-5 cursor-pointer accent-blue-600"
          }
        ) }),
        /* @__PURE__ */ jsxs2("div", { className: "flex-shrink-0", children: [
          item.imageUrl ? /* @__PURE__ */ jsx5(
            "img",
            {
              src: item.imageUrl,
              alt: item.name,
              className: "w-28 h-28 md:w-32 md:h-32 rounded-xl object-cover shadow-md",
              onError: (e) => {
                var _a;
                e.currentTarget.style.display = "none";
                (_a = e.currentTarget.nextElementSibling) == null ? void 0 : _a.classList.remove("hidden");
              }
            }
          ) : null,
          /* @__PURE__ */ jsx5(
            "div",
            {
              className: `w-28 h-28 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md ${item.imageUrl ? "hidden" : ""}`,
              children: /* @__PURE__ */ jsx5("span", { className: "text-gray-400 text-3xl", children: "\u{1F4E6}" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx5("h3", { className: "font-semibold text-base md:text-lg text-gray-900 mb-2 line-clamp-2", children: item.name }),
          /* @__PURE__ */ jsxs2("div", { className: "text-sm text-gray-600 mb-4", children: [
            "Gi\xE1:",
            " ",
            /* @__PURE__ */ jsx5("span", { className: "font-medium", children: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND"
            }).format(item.price) })
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit", children: [
            /* @__PURE__ */ jsx5(
              "button",
              {
                onClick: () => {
                  if (item.quantity > 1) {
                    dispatch({
                      type: "UPDATE",
                      payload: { id: item.id, quantity: item.quantity - 1 }
                    });
                  }
                },
                disabled: item.quantity <= 1,
                className: "w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-gray-700 shadow-sm",
                title: "Gi\u1EA3m s\u1ED1 l\u01B0\u1EE3ng",
                children: "\u2212"
              }
            ),
            /* @__PURE__ */ jsx5(
              CartInput,
              {
                type: "number",
                min: 1,
                value: item.quantity,
                onChange: (e) => {
                  const qty = Math.max(1, Number(e.target.value) || 1);
                  dispatch({
                    type: "UPDATE",
                    payload: { id: item.id, quantity: qty }
                  });
                },
                className: "w-16 text-center font-medium bg-white border-gray-200"
              }
            ),
            /* @__PURE__ */ jsx5(
              "button",
              {
                onClick: () => {
                  dispatch({
                    type: "UPDATE",
                    payload: { id: item.id, quantity: item.quantity + 1 }
                  });
                },
                className: "w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 transition-all font-medium text-gray-700 shadow-sm",
                title: "T\u0103ng s\u1ED1 l\u01B0\u1EE3ng",
                children: "+"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "flex-shrink-0 text-right flex flex-col items-end gap-4", children: [
          /* @__PURE__ */ jsx5("div", { className: "text-xl md:text-2xl font-bold text-red-600", children: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
          }).format(item.price * item.quantity) }),
          /* @__PURE__ */ jsx5(
            CartButton,
            {
              variant: "danger",
              onClick: () => {
                if (window.confirm(
                  "B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n x\xF3a s\u1EA3n ph\u1EA9m n\xE0y kh\u1ECFi gi\u1ECF h\xE0ng?"
                )) {
                  dispatch({ type: "REMOVE", payload: { id: item.id } });
                }
              },
              className: "text-sm py-2 px-4",
              children: "\u{1F5D1}\uFE0F X\xF3a"
            }
          )
        ] })
      ] })
    },
    item.id
  )) });
};

// src/cart/CartSummary.tsx
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var CartSummary = ({ onCheckout }) => {
  const { state } = useCart();
  const selectedItems = state.items.filter((i) => i.selected);
  const total = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  const selectedIds = selectedItems.map((i) => i.id);
  return /* @__PURE__ */ jsxs3("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-center text-sm text-gray-600", children: [
      /* @__PURE__ */ jsx6("span", { children: "S\u1ED1 l\u01B0\u1EE3ng s\u1EA3n ph\u1EA9m:" }),
      /* @__PURE__ */ jsx6("strong", { className: "text-gray-900", children: totalItems })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-center text-base", children: [
      /* @__PURE__ */ jsx6("span", { className: "font-medium", children: "T\u1ED5ng c\u1ED9ng:" }),
      /* @__PURE__ */ jsx6("strong", { className: "text-xl text-red-600", children: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(total) })
    ] }),
    /* @__PURE__ */ jsx6(
      CartButton,
      {
        variant: "primary",
        disabled: selectedIds.length === 0,
        onClick: () => onCheckout && onCheckout(selectedIds),
        className: "w-full !py-3 !text-base !font-semibold",
        children: selectedIds.length > 0 ? `Thanh to\xE1n (${selectedIds.length} s\u1EA3n ph\u1EA9m)` : "Vui l\xF2ng ch\u1ECDn s\u1EA3n ph\u1EA9m"
      }
    )
  ] });
};

// src/ui/CartModal.tsx
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
var CartModal = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "X\xE1c nh\u1EADn",
  cancelText = "H\u1EE7y"
}) => {
  if (!open) return null;
  return /* @__PURE__ */ jsx7("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: /* @__PURE__ */ jsxs4("div", { className: "bg-white rounded-lg shadow-lg max-w-md w-full p-4", children: [
    title && /* @__PURE__ */ jsx7("h2", { className: "text-lg font-semibold mb-2 border-b pb-2", children: title }),
    /* @__PURE__ */ jsx7("div", { className: "mb-4", children }),
    /* @__PURE__ */ jsxs4("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx7(CartButton, { variant: "secondary", onClick: onClose, children: cancelText }),
      onConfirm && /* @__PURE__ */ jsx7(CartButton, { variant: "primary", onClick: onConfirm, children: confirmText })
    ] })
  ] }) });
};
export {
  CartButton,
  CartCard,
  CartInput,
  CartItemList,
  CartModal,
  CartProvider,
  CartSummary,
  useCart
};
