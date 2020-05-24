const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const HospitalAdminModel = require("./hospital_admin.js");
const PoliceAdminModel = require("./police_admin.js");
const CrashModel = require("./crash.js");
const PoliceModel = require("./police.js");
const RiderModel = require("./rider.js");
const HospitalModel = require("./hospital.js");

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

const HospitalAdmin = HospitalAdminModel(sequelize, Sequelize);
const PoliceAdmin = PoliceAdminModel(sequelize, Sequelize);
const Crash = CrashModel(sequelize, Sequelize);
const Police = PoliceModel(sequelize, Sequelize);
const Rider = RiderModel(sequelize, Sequelize);
const Hospital = HospitalModel(sequelize, Sequelize);

//Relations
Hospital.hasOne(HospitalAdmin, {
  foreignKey: "hospital_ID",
});
HospitalAdmin.belongsTo(Hospital, {
  foreignKey: "hospital_ID",
});

Police.hasOne(PoliceAdmin, {
  foreignKey: "police_ID",
});
PoliceAdmin.belongsTo(Police, {
  foreignKey: "police_ID",
});

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
module.exports = { HospitalAdmin, PoliceAdmin, Crash, Police, Rider, Hospital };
