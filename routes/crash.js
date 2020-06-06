const express = require("express");
const controller = require("./../controllers/crash");

const router = express.Router({ mergeParams: true });
router.get("/emergencycrashes", controller.getEmergencyCrashes);
//route for cdh to add data
router.get(
  "/update/:id/:latitude/:longitude/:timeStamp",
  controller.addEmergencyCrash
);

router.route("/").get(controller.getAllCrashes).post(controller.addCrash);
router.get("/:id", controller.getCrash);

module.exports = router;
