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
      defaultValue: new Date()
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "in_cart",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    modelName: "order",
  }
);

module.exports = Order;
