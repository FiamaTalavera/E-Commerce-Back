require('dotenv').config()
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db");
const models = require("./models/index");
const routes = require("./routes");

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: `${process.env.URL}3000`,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    credentials: true,
  })
);

app.use("/", routes);

db.sync({ force: false }).then(() => {
  console.log("DB");
  app.listen(process.env.PORT, () => {
    console.log("Server on port 3001");
  });
});
