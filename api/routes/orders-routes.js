const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const { validateUser } = require('../middlewares/auth');
const Product = require('../models/Products');
const { generateOrderNumber } = require('../utils/functions');
const History = require('../models/History');

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
                        return res.status(404).json({ message: 'Producto no encontrado' })
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

router.put('/updateQuantity/:orderId', (req, res, next) => {
    const { orderId } = req.params;
    const { quantity } = req.body;

    Order.findByPk(orderId)
        .then((order) => {
            if (!order) {
                return res.status(404).json({ message: 'Orden no encontrada' });
            }

            order.quantity = quantity;

            return order.save();
        })
        .then((updatedOrder) => {
            res.status(200).json({ message: 'Cantidad actualizada', updatedOrder });
        })
        .catch(next);
});

router.post('/checkout', validateUser, (req, res, next) => {
    const { userId } = req.user;
    const orderNumber = generateOrderNumber();

    Order.findAll({ where: { userId } }).then((order) => {
        order.map((item) => {
            History.create({
                userId,
                order_number: orderNumber,
                productId: item.productId,
                quantity: item.quantity,
            });
        });
        Order.destroy({
            where: {
                userId,
            },
        });
    });

    return res.status(200).json({ message: 'Compra completada' });
});

module.exports = router;
