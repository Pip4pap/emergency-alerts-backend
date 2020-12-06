const express = require("express");
const controller = require("./../controllers/police");

const router = express.Router({mergeParams: true});

router.route("/").get(controller.getAllPolices).post(controller.addPolice);
router.get("/:id", controller.getPolice);

module.exports = router;
