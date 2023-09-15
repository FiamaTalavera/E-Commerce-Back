const User = require("../models/Users");
const { generateToken } = require("../config/tokens");
const History = require("../models/History");
const Products = require("../models/Products");

const register = (req, res, next) => {
  const { email, last_name, name, password, address, snippet } = req.body;
  User.create({ email, last_name, name, password, address, snippet }).then(
    (user) => res.status(201).send(user)
  );
};

const login = (req, res, next) => {
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
};

const persistencia = (req, res) => {
  res.send(req.user);
};

const logout = (req, res) => {
  res.clearCookie("token");

  res.sendStatus(204).end();
};

const updateUser = (req, res, next) => {
  const { email, last_name, name, address } = req.body;
  const userId = req.user.userId;

  User.update(
    { email, last_name, name, address },
    { where: { id: userId }, returning: true }
  )
    .then(([numChanges, updatedUser]) => {
      res.status(200).send(updatedUser[0]);
    })
    .catch(next);
};

const historyUser = (req, res, next) => {
  const { userId } = req.user;
  History.findAll({
    where: {
      userId,
    },
  })
    .then((histories) => {
      const promises = histories.map((history) => {
        return Products.findOne({
          where: {
            id: history.productId,
          },
        }).then((product) => {
          return {
            ...history.toJSON(),
            product,
          };
        });
      });

      return Promise.all(promises);
    })
    .then((historiesWithData) => {
      res.status(200).json(historiesWithData);
    })
    .catch((error) => {
      console.error("Error al obtener las órdenes con productos:", error);
      res
        .status(500)
        .json({ message: "Error al obtener las órdenes con productos" });
    });
};

module.exports = {
  register,
  login,
  persistencia,
  logout,
  updateUser,
  historyUser,
};
