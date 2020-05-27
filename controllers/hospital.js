const { Hospital } = require("./../models/sequelize");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

module.exports = {
  addHospital: catchAsync(async (req, res, next) => {
    hospital = await Hospital.create(req.body);

    res.status(201).json({
      status: "success",
      data: hospital,
    });
  }),
  getAllHospitals: catchAsync(async (req, res, next) => {
    hospitals = await Hospital.findAll();

    res.status(200).json({
      status: "success",
      data: hospitals,
    });
  }),
  getHospital: catchAsync(async (req, res, next) => {
    hospital = await Hospital.findByPk(req.params.id);

    if (!hospital)
      return next(new AppError("No hospital exists with such an ID", 404));

    res.status(200).json({
      status: "success",
      data: hospital,
    });
  }),
  addCrashToHospital: catchAsync(async (req, res, next) => {
    hospital = await Hospital.findByPk(req.params.id);
  }),
};
