const { Crash } = require("./../models/sequelize");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const { Op } = require("sequelize");

module.exports = {
  addCrash: catchAsync(async (req, res, next) => {
    //TODO: this will change to use a req params
    crash = await Crash.create(req.body);

    // crash.addHospital(,{through:{status:"viewing"}})
    res.status(201).json({
      status: "success",
      data: crash,
    });
  }),
  getAllCrashes: catchAsync(async (req, res, next) => {
    crashes = await Crash.findAll();

    res.status(200).json({
      status: "success",
      data: crashes,
    });
  }),
  getCrash: catchAsync(async (req, res, next) => {
    crash = await Crash.findByPk(req.params.id);

    if (!crash)
      return next(new AppError("No hospital exists with such an ID", 404));

    res.status(200).json({
      status: "success",
      data: crash,
    });
  }),
  getEmergencyCrashes: catchAsync(async (req, res, next) => {
    crashes = await Crash.findAll({
      where: {
        timestamp: {
          [Op.gt]: new Date(new Date() - 30 * 60 * 1000),
        },
      },
    });
  }),
};
