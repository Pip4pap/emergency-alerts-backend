const { HospitalAdmin } = require("./../models/sequelize");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

module.exports = {
  addHospitalAdmin: catchAsync(async (req, res, next) => {
    const hospitalAdmin = await HospitalAdmin.create(req.body);

    res.status(200).json({
      status: "success",
      data: hospitalAdmin,
    });
  }),
  getAllHospitalAdmins: catchAsync(async (req, res, next) => {
    const hospitalAdmins = await HospitalAdmin.findAll();

    res.status(200).json({
      status: "success",
      data: hospitalAdmins,
    });
  }),
  getHospitalAdmin: catchAsync(async (req, res, next) => {
    const hospitalAdmin = await HospitalAdmin.findByPk(req.params.id);

    if (!hospitalAdmin)
      return next(new AppError("No hospital admin exists with that is", 404));

    res.status(200).json({
      status: "success",
      data: hospitalAdmin,
    });
  }),
};
