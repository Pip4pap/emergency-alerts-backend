const express = require("express");
const controller = require("./../controllers/crash");

const router = express.Router({ mergeParams: true });
router.route("/").get(controller.getAllCrashes).post(controller.addCrash);
router.get("/:id", controller.getCrash);
// router.get("/emergencycrashes", controller.getEmergencyCrashes);
module.exports = router;
