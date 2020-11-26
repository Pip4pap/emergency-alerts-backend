const express = require("express");
const controller = require("./../controllers/rider");
const appAuthProtector = require('./../auth/userAuthProtector');

const router = express.Router({mergeParams: true});
router.use(appAuthProtector());
router.route("/").get(controller.getAllRiders).post(controller.addRider);
router.get("/:id", controller.getRider);
module.exports = router;
