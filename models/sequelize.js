const Sequelize = require("sequelize");
const adminModel = require("./admin_users.js");
const crashModel = require("./crash.js");
const policeModel = require("./police.js");
const riderModel = require("./rider.js");
const hospitalModel = require("./hospital.js");

//Create a sequelize connection to the database
const sequelize = new Sequelize("crashes", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    timestamps: false,
  },
});

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
