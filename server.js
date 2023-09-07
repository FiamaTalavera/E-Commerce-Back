const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./api/config/db");
const models = require("./api/models/index")
const routes = require("./api/routes")

app.use(express.json());

app.use(cors());

app.use("/", routes)

db.sync({ force: false }).then(() => {
  console.log("DB");
  app.listen(3001, () => {
    console.log("Server on port 3001");
  });
});
