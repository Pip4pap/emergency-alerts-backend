const express = require("express");
const controller = require("./../controllers/hospital");

const router = express.Router({ mergeParams: true });

router.route("/").get(controller.getAllHospitals).post(controller.addHospital);
router.get("/:id", controller.getHospital);

module.exports = router;
