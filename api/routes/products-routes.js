const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Product = require("../models/Products");
const Order = require("../models/Orders");
const { validateUser } = require("../middlewares/auth");


router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, imageURL, stock } = req.body;
  Product.update(
    { name, description, price, imageURL, stock },
    {
      where: {
        id: req.id,
      },
      returning: true,
    }
  )
    .then(([numChanges, product]) => {
      res.status(200).send(product[0]);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  Product.findOne({
    where: {
      id: id,
    },
  })
    .then((product) => {
      if (product.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.status(200).json(product);
    })
    .catch(next);
});

router.get("/", (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
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

router.post("/addToCart/:productId", validateUser, (req, res, next) => {
  const { productId } = req.params;
  const { userId } = req.user;
  const { quantity } = req.body;

  if (!userId)
    return res.status(401).json({ message: "Usuario no encontrado" });

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

// ruta para modificar producto

router.put("/modify/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, imageURL, stock } = req.body;

  Product.update(
    {
      name,
      description,
      price,
      imageURL,
      stock,
    },
    {
      where: { id },
      returning: true,
    }
  ).then(([numChanges, [updatedProduct]]) => {
    if (numChanges === 0) {
      return res.status(404).json({ message: "Product Not Found" });
    }


    res.status(200).json(updatedProduct);
  });
});

router.post("/addToCart/:productId", validateUser, (req, res, next) => {
  const { productId } = req.params;
  const { userId } = req.user;
  const { quantity } = req.body;

  if (!userId)
    return res.status(401).json({ message: "Usuario no encontrado" });

  let existingOrder;



    res.status(200).json(updatedProduct);
  });

router.get("/search/:productName", (req, res, next) => {
  const { productName } = req.params;

  Product.findAll({
    where: {
      name: {
        [Op.iLike]: `%${productName}%`,
      },
    },
  })
    .then((products) => {
      if (products.length === 0)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).send(products);
    })
    .catch(next);
});

//ruta para filtar productos por categoria
router.get("/category/:categoryId", (req, res, next) => {
  const { categoryId } = req.params;

  // busco productos en una categoria especifica
  Product.findAll({
    where: {
      categoryId: categoryId, // los filtro por su Id
    },
  })
    .then((products) => {
      if (products.length === 0) {
        return res
          .status(404)
          .json({
            message: "No se encontraron productos para esta categoría.",
          });
      }
      res.status(200).json(products); // devuelvo los productos encontrados
    })
    .catch(next);
});

module.exports = router;
