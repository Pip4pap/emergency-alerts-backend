const { HospitalAdmin } = require("./../models/hospital_admin");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

module.exports = {
  addHospitalAdmin: catchAsync(async (req, res, next) => {
    const hospitalAdmin = HospitalAdmin.create(req.body);

    res.status(200).json({
      status: "success",
      data: hospitalAdmin,
    });
  }),
  getAllHospitalAdmins: catchAsync(async (req, res, next) => {}),
  getHospitalAdmin: catchAsync(async (req, res, next) => {}),
};
