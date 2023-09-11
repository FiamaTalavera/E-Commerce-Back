const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const { validateUser } = require('../middlewares/auth');
const Product = require('../models/Products');

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
            const promises = orders.map((order) => {
                return Product.findOne({
                    where: {
                        id: order.productId,
                    },
                }).then((product) => {
                    return {
                        // convertimos lo de Sequelize a un objeto JS
                        ...order.toJSON(),
                        product,
                    };
                });
            });
            return Promise.all(promises);
        })
        .then((ordersWithData) => {
            console.log(ordersWithData);
            res.status(200).send(ordersWithData);
        })
        .catch(next);
});

router.delete('/remove/:orderId/:productId', (req, res, next) => {
    const { orderId, productId } = req.params;

    Order.findByPk(orderId)
        .then((order) => {
            if (!order) {
                return res.status(404).json({ message: 'Orden no encontrada' });
            }

            Product.findByPk(productId)
                .then((product) => {
                    if (!product) {
                        return res.status(404).json({ message: 'Producto no encontrado' });
                    }

                    order
                        .destroy(product)
                        .then(() => {
                            res.status(200).json({ message: 'Producto removido' });
                        })
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;
