const express = require("express");
const controller = require("./../controllers/hospital");
const appAuthController = require('./../auth/userAuthController');

const {HospitalAdmin} = require('./../models/sequelize');

const HospitalAdminAuth = new appAuthController(HospitalAdmin)

const router = express.Router({mergeParams: true});

router.route("/").get(HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAllHospitals).post(HospitalAdminAuth.restrictTo('HospitalAdmin'), controller.addHospital);
router.get("/:id", HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getHospital);

module.exports = router;
