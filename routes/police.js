const express = require("express");
const controller = require("./../controllers/police");
const appAuthController = require('./../auth/userAuthController');

const {PoliceAdmin} = require('./../models/sequelize');

const PoliceAdminAuth = new appAuthController(PoliceAdmin)

const router = express.Router({mergeParams: true});

router.route("/").get(PoliceAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAllPolices).post(PoliceAdminAuth.restrictTo('PoliceAdmin'), controller.addPolice);
router.get("/:id", PoliceAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getPolice);

module.exports = router;
