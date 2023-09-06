const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Review extends Model {}

Review.init(
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        // que queda mejor: calificar de 1 a 10 o de 1 a 5?
        min: 1,
        max: 10,
      },
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "review",
  }
);

module.exports = Review;
