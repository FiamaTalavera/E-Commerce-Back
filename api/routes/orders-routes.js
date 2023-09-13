const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const { validateUser } = require('../middlewares/auth');
const Product = require('../models/Products');
const { generateOrderNumber } = require('../utils/functions');
const History = require('../models/History');

const nodemailer = require('nodemailer');

// config nodemailer / email

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587, //587
    secure: false,
    auth: {
        user: "en.el.horno@outlook.com.ar",
        pass: "Enelhorno.p5"
    }
})

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
    console.log("req.user ---> ", req.user.email)
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

        const mailOptions = {
            from: "en.el.horno@outlook.com.ar",
            to: req.user.email,
            subject: "Confirmación de compra",
            text: `¡Tu compra ha sido completada con éxito! Numero de orden #${orderNumber}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.error("Error en el correo de confirmacion", error)
            } else {
                console.log("Correo confirmacion enviado", info.response)
            }
        })


        Order.destroy({
            where: {
                userId,
            },
        });
    });

    return res.status(200).json({ message: 'Compra completada' });
});

module.exports = router;
