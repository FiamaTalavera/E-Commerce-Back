const { DataTypes, Model } = require("sequelize");

const sequelize = require("../config/db");

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "in_cart",
    },
  },
  {
    sequelize,
    modelName: "order",
  }
);

module.exports = Order;
