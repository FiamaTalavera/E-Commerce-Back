const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const { validateUser } = require('../middlewares/auth');
const Product = require('../models/Products')

router.get('/', validateUser, (req, res, next) => {
    // para sacar las ordenes del usuario logueado
    const { userId } = req.user;
    Order.findAll({
        where: {
            userId,
        },
    })
        .then((orders) => {
            // array de promesas
            const promises = orders.map((order => {
                return Product.findOne({
                    where: {
                        id: order.productId
                    },
                })
                    .then((product) => {
                        return {
                            // convertimos lo de Sequelize a un objeto JS
                            ...order.toJSON(),
                            product
                        };
                    });
            }));
            return Promise.all(promises)
        })
        .then((ordersWithData) => {
            console.log(ordersWithData);
            res.status(200).send(ordersWithData)
        })
        .catch(next);
});

module.exports = router;
