const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { generateToken } = require("../config/tokens");
const { validateUser } = require("../middlewares/auth");
const Orders = require("../models/Orders");

router.post("/register", (req, res, next) => {
  const { email, last_name, name, password, address, snippet } = req.body;
  // console.log(req.body);
  User.create({ email, last_name, name, password, address, snippet }).then(
    (user) => res.status(201).send(user)
  );
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({
    where: {
      email,
    },
  }).then((user) => {
    if (!user) return res.status(401).json({ message: "User no encontrado" });

    user.validatePassword(password).then((isValid) => {
      if (!isValid)
        return res.status(401).json({ message: "Contraseña no validada" });
      else {
        const payload = {
          userId: user.id,
          email: user.email,
          name: user.name,
          last_name: user.last_name,
          address: user.address,
          is_admin: user.is_admin,
        };
        const token = generateToken(payload);
        res.cookie("token", token);
        res.send(payload);
      }
    });
  });
});

router.get("/me", validateUser, (req, res) => {
  res.send(req.user);
});

router.post("/logout", (req, res) => {
  res.clearCookie("token"); // borro la cookie de token

  res.sendStatus(204).end();
});

router.put("/profile", validateUser, (req, res, next) => {
  const { email, last_name, name, address } = req.body;
  // console.log("req.body /profile ---> ", req.body);
  const userId = req.user.userId;
  // console.log("req.user /profile --->", req.user);

  User.update(
    { email, last_name, name, address },
    { where: { id: userId }, returning: true }
  )
    .then(([numChanges, updatedUser]) => {
      res.status(200).send(updatedUser[0]);
    })
    .catch(next);
});

router.get("/userId/history", (req, res, next) => {
  const userId = req.user.id;

  History.findAll({
    where: { userId },
    include: [{ model: Product }],
  })
    .then((userOrderHistory) => {
      res.status(200).json(userOrderHistory);
    })
    .catch((error) => {
      console.error('Error al obtener el historial de órdenes:', error);
      res.status(500).json({ message: 'Error al obtener el historial de órdenes' });
    });
});

module.exports = router;
