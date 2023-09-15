const express = require("express");
const router = express.Router();
const { validateUser } = require("../middlewares/auth");
const { register, login, persistencia, logout, updateUser, historyUser } = require("../controllers/users.controllers");

router.post("/register", register);

router.post("/login", login);

router.get("/me", validateUser, persistencia);

router.post("/logout", logout);

router.put("/profile", validateUser, updateUser);

router.get("/history", validateUser, historyUser);

module.exports = router;
