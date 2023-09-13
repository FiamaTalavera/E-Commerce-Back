const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/db');

class History extends Model {}

History.init(
    {
        order_number: {
            type: DataTypes.INTEGER,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        productId: {
            type: DataTypes.INTEGER,
        },
        quantity: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        modelName: 'history',
    }
);

module.exports = History