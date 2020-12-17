const express = require("express");
const controller = require("./../controllers/hospital");
const appAuthProtector = require('./../auth/userAuthProtector');
const appAuthController = require('./../auth/userAuthController');

const {HospitalAdmin} = require('./../models/sequelize');

const HospitalAdminAuth = new appAuthController(HospitalAdmin)

const router = express.Router({mergeParams: true});

router.use(appAuthProtector());

router.route("/").get(HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAllHospitals).post(HospitalAdminAuth.restrictTo('HospitalAdmin'), controller.addHospital);
router.get("/:id", HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getHospital);

module.exports = router;
