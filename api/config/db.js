const sequelize = require("sequelize");

const db = new sequelize(process.env.DBNAME, null, null, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = db;
