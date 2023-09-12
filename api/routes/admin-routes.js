const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const Category = require('../models/Category');

router.delete('/:productId', (req, res, next) => {
    const { productId } = req.params;

    Product.findByPk(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            } else {
                product
                    .destroy()
                    .then(() => {
                        res.status(200).json({ message: 'Producto removido' });
                    })
                    .catch(next);
            }
        })
        .catch(next);
});

router.post('/categories', (req, res, next) => {
    const { name } = req.body;

    Category.create({ name: name })
        .then(() => {
            res.status(201).json({ message: 'La nueva categoría se creó correctamente' });
        })
        .catch(next);
});

router.delete('/categories/:categoryId', (req, res, next) => {
    const { categoryId } = req.params;

    Category.findByPk(categoryId)
        .then((category) => {
            if (!category) return res.status(404).json({ message: 'Categoria no encontrada' });
            category
                .destroy()
                .then(() => {
                    res.status(200).json({ message: 'Categoria eliminada' });
                })
                .catch(next);
        })
        .catch(next);
});

router.post('/addProduct', (req, res, next) => {
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

router.put('/categories/:categoryId', (req, res, next) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    Category.update(
        { name },
        {
            where: {
                id: categoryId,
            },
            returning: true,
        }
    ).then(([numChanges, category]) => {
      res.status(200).send(category[0])
    })
  .catch(next)
});

module.exports = router;
