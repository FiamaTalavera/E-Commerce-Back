const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const Category = require('../models/Category');

// ruta eliminar un producto

router.delete('/products/:productId', (req, res, next) => {
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

// ruta crear categoria

router.post('/categories', (req, res, next) => {
    const { name } = req.body;

    Category.create({ name: name })
        .then(() => {
            res.status(201).json({ message: 'La nueva categoría se creó correctamente' });
        })
        .catch(next);
});

// ruta eliminar categoria

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

// ruta crear producto

router.post('/products/addProduct', (req, res, next) => {
    const { name, description, price, imageURL, stock, categoryId } = req.body;
    Product.create({
        name,
        description,
        price,
        imageURL,
        stock,
    })
        .then((newProduct) => {
            newProduct.setCategory(categoryId)
            res.status(201).send(newProduct)})
        .catch(next);
});

// ruta modificar categoria

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

// ruta ver todas las categorias

router.get("/categories", (req, res, next) => {

  Category.findAll()
    .then((categories) => {
      res
        .status(200)
        .send(categories);
    })
    .catch(next);
});

// ruta para modificar producto

router.put("/products/modify/:id", (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, imageURL, stock, categoryId } = req.body;
    // console.log("req.body ---> ", req.body)

    Product.update(
      {
        name,
        description,
        price,
        imageURL,
        stock,
        categoryId
      },
      {
        where: { id },
        returning: true,
      }
    )
      .then(([numChanges, [updatedProduct]]) => {
        if (numChanges === 0) {
          return res.status(404).json({ message: "Product Not Found" });
        }
        // console.log("updatedProduct ---> ",updatedProduct)
        res.status(200).json(updatedProduct);
      })
      .catch(next);
  });

  // ruta ver todos los productos 

  router.get("/products", (req, res, next) => {
    Product.findAll()
      .then((products) => {
        res.status(200).json(products);
      })
      .catch(next);
  });



module.exports = router;
