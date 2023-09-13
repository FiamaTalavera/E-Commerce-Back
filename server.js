const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./api/config/db");
const models = require("./api/models/index");
const routes = require("./api/routes");

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    credentials: true,
  })
);

app.use("/", routes);

db.sync({ force: false }).then(() => {
  console.log("DB");
  app.listen(3001, () => {
    console.log("Server on port 3001");
  });
});
