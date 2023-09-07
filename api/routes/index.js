const express = require("express");
const router = express.Router();

const products = require("./products-routes")
const user = require("./users-routes")

router.use("/products", products)
router.use("/user", user)

module.exports = router;