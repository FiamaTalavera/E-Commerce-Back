const {Sequelize, Model} = require('sequelize')

class Product extends Model { }

Product.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
        },
        price: {
            type: Sequelize.INTEGER
        },
        imageURL: {
            type: Sequelize.STRING
        },
        stock: {
            type: Sequelize.INTEGER
        }
    },
    {sequelize: db, modelName: 'product'}
)

module.exports = Product