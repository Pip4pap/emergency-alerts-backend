const express = require("express");
const controller = require("./../controllers/hospital_admin");
const appAuthController = require("./../auth/userAuthController");
const { HospitalAdmin } = require("./../models/sequelize");

//creates an auth controller for the hospital admin
const hospitalAdminAuth = new appAuthController(HospitalAdmin);

const router = express.Router({ mergeParams: true });

router.post("/signup", hospitalAdminAuth.signup());
router.post("/login", hospitalAdminAuth.login());

router
  .route("/")
  .get(controller.getAllHospitalAdmins)
  .post(controller.addHospitalAdmin);

router.get("/:id", controller.getHospitalAdmin);
router.get("/:id/hospital", controller.getAdminHospital);
module.exports = router;
