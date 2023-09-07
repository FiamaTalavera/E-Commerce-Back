const express = require("express");
const router = express.Router();
const Product = require("../models/Products");

router.put("/products/:id", (req, res, next) => {
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

router.post("/products", (req, res, next) => {
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

module.exports = router
