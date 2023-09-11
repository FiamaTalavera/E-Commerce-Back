const express = require("express");
const router = express.Router();

const products = require("./products-routes")
const user = require("./users-routes")
const orders = require("./orders-routes")
const admin = require("./admin-routes")

router.use("/products", products)
router.use("/user", user)
router.use("/order", orders)
router.use("/admin", admin)

module.exports = router;
