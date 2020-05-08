const express = require("express");
const bodyParser = require("body-parser");
const sanitizer = require("express-sanitizer");
const xss = require("xss-clean");
const cors = require("cors");
const request = require("request-promise");

//Import our models
const {
  admin,
  crash,
  police,
  rider,
  hospital,
} = require("./models/sequelize.js");

const app = express();

// -------------------Enable CORS for all origins-------------------
app.use(cors());

// -------------------Parsing APP data-------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/json" }));

// -------------------Data sanitization against SQL injection attacks-------------------
app.use(sanitizer());

// -------------------Data sanitization against xss attacks-------------------
app.use(xss());

// GLOBAL MIDDLEWARE

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Emergency alerts system" });
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
