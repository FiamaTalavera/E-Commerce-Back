const Products = require("./Products");
const Category = require("./Category");
const User = require("./Users");
const Order = require("./Orders");
const Review = require("./Reviews");

User.hasMany(Order);
Review.belongsTo(User);
Products.belongsToMany(User, { through: Order });
User.belongsToMany(Products, { through: Order });
Category.hasMany(Products);
Products.belongsTo(Category);
Products.hasMany(Review);
