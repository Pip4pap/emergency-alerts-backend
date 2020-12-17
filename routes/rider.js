const express = require("express");
const controller = require("./../controllers/rider");
const appAuthController = require('./../auth/userAuthController');
const appAuthProtector = require('./../auth/userAuthProtector');
const {Rider} = require('./../models/sequelize');

const RiderAuth = new appAuthController(Rider);

const router = express.Router({mergeParams: true});

router.post('/login', RiderAuth.login());
router.get('/logout', RiderAuth.logout());

router.use(appAuthProtector());

router.route("/").get(RiderAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAllRiders).post(RiderAuth.restrictTo('EmergencyAlertsAdmin'), controller.addRider);
router.get("/me", RiderAuth.restrictTo('Rider'), controller.getRider);
module.exports = router;
