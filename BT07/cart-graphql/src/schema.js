const { gql } = require("apollo-server-express");

// In-memory cart storage for demo purposes
const cart = [];

const typeDefs = gql`
  type CartItem {
    id: ID!
    productId: ID!
    name: String!
    price: Float!
    quantity: Int!
    selected: Boolean!
  }

  type Query {
    cart: [CartItem!]!
  }

  input CartItemInput {
    productId: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  type Mutation {
    addToCart(input: CartItemInput!): CartItem!
    updateCartItem(id: ID!, quantity: Int!): CartItem!
    removeCartItem(id: ID!): Boolean!
    toggleSelect(id: ID!): CartItem!
    checkout(selectedIds: [ID!]!): Boolean!
  }
`;

const resolvers = {
  Query: {
    cart: () => cart,
  },
  Mutation: {
    addToCart: (_, { input }) => {
      const id = String(Date.now());
      const item = {
        id,
        selected: false,
        ...input,
      };
      cart.push(item);
      return item;
    },
    updateCartItem: (_, { id, quantity }) => {
      const item = cart.find((i) => i.id === id);
      if (!item) {
        throw new Error("Cart item not found");
      }
      item.quantity = quantity;
      return item;
    },
    removeCartItem: (_, { id }) => {
      const index = cart.findIndex((i) => i.id === id);
      if (index === -1) return false;
      cart.splice(index, 1);
      return true;
    },
    toggleSelect: (_, { id }) => {
      const item = cart.find((i) => i.id === id);
      if (!item) {
        throw new Error("Cart item not found");
      }
      item.selected = !item.selected;
      return item;
    },
    checkout: (_, { selectedIds }) => {
      // O đây demo nên return thôi
      console.log("Checkout items:", selectedIds);
      return true;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
