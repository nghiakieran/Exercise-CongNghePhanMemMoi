export const GET_CART = `
  query GetCart {
    cart {
      id
      productId
      name
      price
      quantity
      selected
      imageUrl
    }
  }
`;

export const ADD_TO_CART = `
  mutation AddToCart($input: CartItemInput!) {
    addToCart(input: $input) {
      id
      productId
      name
      price
      quantity
      selected
      imageUrl
    }
  }
`;

export const UPDATE_CART_ITEM = `
  mutation UpdateCartItem($id: ID!, $quantity: Int!) {
    updateCartItem(id: $id, quantity: $quantity) {
      id
      quantity
    }
  }
`;

export const REMOVE_CART_ITEM = `
  mutation RemoveCartItem($id: ID!) {
    removeCartItem(id: $id)
  }
`;

export const TOGGLE_SELECT = `
  mutation ToggleSelect($id: ID!) {
    toggleSelect(id: $id) {
      id
      selected
    }
  }
`;

export const CHECKOUT = `
  mutation Checkout($ids: [ID!]!) {
    checkout(selectedIds: $ids)
  }
`;
