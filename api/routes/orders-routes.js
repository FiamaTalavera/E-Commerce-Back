const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Product = require("../models/Products");


router.delete("/remove/:orderId/:productId", (req, res, next) => {
  const { orderId, productId } = req.params;

  Order.findByPk(orderId)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      Product.findByPk(productId)
        .then((product) => {
          if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
          }

          order
            .removeProduct(product)
            .then(() => {
              res.status(200).json({ message: "Product removido" });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
