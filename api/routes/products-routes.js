const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const Order = require('../models/Orders');
const { validateUser } = require('../middlewares/auth');

router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, imageURL, stock } = req.body;
    Product.update(
        { name, description, price, imageURL, stock },
        {
            where: {
                id,
            },
            returning: true,
        }
    )
        .then(([numChanges, product]) => {
            res.status(200).send(product[0]);
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    Product.findOne({
        where: {
            id,
        },
    })
        .then((product) => {
            if (!product) {
                res.status(404).json({ message: 'Producto no encontrado' });
            } else {
                res.status(200).json(product);
            }
        })
        .catch(next);
});

router.get('/', (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.status(200).json(products);
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    const { name, description, price, imageURL, stock } = req.body;
    Product.create({
        name,
        description,
        price,
        imageURL,
        stock,
    })
        .then((newProduct) => res.status(201).send(newProduct))
        .catch(next);
});

router.post('/addToCart/:productId', validateUser, (req, res, next) => {
    const { productId } = req.params;
    const { userId } = req.user;
    const { quantity } = req.body;

    if (!userId) return res.status(401).json({ message: 'Usuario no encontrado' });

    let existingOrder;

    Order.findOne({
        where: {
            userId,
            productId,
        },
    })
        .then((order) => {
            if (order) {
                existingOrder = order;
                existingOrder.quantity += quantity;
                return existingOrder.save();
            } else {
                return Order.create({
                    userId,
                    productId,
                    quantity,
                });
            }
        })
        .then((orderProduct) => {
            res.status(existingOrder ? 200 : 201).send(orderProduct);
        })
        .catch(next);
});

module.exports = router;
