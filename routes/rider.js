const express = require("express");
const controller = require("./../controllers/rider");

const router = express.Router({ mergeParams: true });
router.route("/").get(controller.getAllRiders).post(controller.addRider);
router.get("/:id", controller.getRider);
module.exports = router;
