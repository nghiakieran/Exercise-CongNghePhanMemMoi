const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const Favorite = sequelize.define(
  "Favorite",
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
  },
  {
    tableName: "favorites",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  }
);

Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });
Favorite.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
Product.hasMany(Favorite, { foreignKey: "productId", as: "favorites" });

module.exports = Favorite;
