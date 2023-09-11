const express = require("express");
const router = express.Router();
const Product = require("../models/Products");

router.delete("/:productId", (req, res, next) => {
  const { productId } = req.params;

  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      } else {
        product
          .destroy()
          .then(() => {
            res.status(200).json({ message: "Producto removido" });
          })
          .catch(next);
      }
    })
    .catch(next);
});

module.exports = router;
