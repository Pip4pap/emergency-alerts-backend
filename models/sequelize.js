const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const hospitalAdminModel = require("./hospital_admin.js");
const policeAdminModel = require("./police_admin.js");
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
    logging: false,
  }
);

const HospitalAdmin = hospitalAdminModel(sequelize, Sequelize);
const policeAdmin = policeAdminModel(sequelize, Sequelize);
const crash = crashModel(sequelize, Sequelize);
const police = policeModel(sequelize, Sequelize);
const rider = riderModel(sequelize, Sequelize);
const hospital = hospitalModel(sequelize, Sequelize);

// Use this code only in development mode
if (process.env.NODE_ENV === "development") {
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("Databases and tables created altered in dev mode");
    })
    .catch((err) => {
      console.log("Something went wrong with altering tables \n", err);
    });
} else if (process.env.NODE_ENV === "test") {
  //Drop all tables and create them again.
  sequelize.sync({ force: true }).then(() => {
    console.log("Databases and tables created");
  });
}
module.exports = { HospitalAdmin, policeAdmin, crash, police, rider, hospital };
