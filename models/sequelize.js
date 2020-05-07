const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const adminModel = require("./admin_users.js");
const crashModel = require("./crash.js");
const policeModel = require("./police.js");
const riderModel = require("./rider.js");
const hospitalModel = require("./hospital.js");

dotenv.config({ path: __dirname + "./../.env" });

//Create a sequelize connection to the database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
    define: {
      timestamps: false,
    },
  }
);

const admin = adminModel(sequelize, Sequelize);
const crash = crashModel(sequelize, Sequelize);
const police = policeModel(sequelize, Sequelize);
const rider = riderModel(sequelize, Sequelize);
const hospital = hospitalModel(sequelize, Sequelize);

// Use this code only in development mode
// sequelize.sync({ force: true }).then(() => {
//   console, log("Databases and tables created");
// });

module.exports = { admin, crash, police, rider, hospital };
