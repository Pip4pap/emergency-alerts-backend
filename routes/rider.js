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

router.route("/").get(controller.getAllRiders).post(controller.addRider);
router.get("/:id", controller.getRider);
module.exports = router;
