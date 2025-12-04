const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const Comment = sequelize.define(
  "Comment",
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  }
);

Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Comment.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Product.hasMany(Comment, { foreignKey: "productId", as: "comments" });

module.exports = Comment;


