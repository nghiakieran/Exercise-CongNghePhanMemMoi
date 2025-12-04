const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const Purchase = sequelize.define(
  "Purchase",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "purchases",
    timestamps: true,
  }
);

Purchase.belongsTo(User, { foreignKey: "userId", as: "user" });
Purchase.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Purchase, { foreignKey: "userId", as: "purchases" });
Product.hasMany(Purchase, { foreignKey: "productId", as: "purchases" });

module.exports = Purchase;


