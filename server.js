const express = require("express");
const bodyParser = require("body-parser");

//Import our models
const {
  admin,
  crash,
  police,
  rider,
  hospital,
} = require("./models/sequelize.js");

const app = express();
app.use(bodyParser.json());

// API ENDPOINTS
app.get("/api", (req, res) => {
  res.send("Welcome to the Crash detection system");
});
//admin routes
app.post("/api/admin", (req, res) => {
  admin.create(req.body).then((admin) => res.json(admin));
});
// get all admins
app.get("/api/admin", (req, res) => {
  admin.findAll().then((admins) => res.json(admins));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
