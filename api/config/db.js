const sequelize = require("sequelize");
const dotenv = require("dotenv")
dotenv.config()


const db = new sequelize(process.env.DBNAME, null, null, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = db;
