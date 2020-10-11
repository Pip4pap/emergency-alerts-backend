const { EmergencyAlertsAdmin } = require('./../models/sequelize');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

module.exports = {
  addEmergencyAlertsAdmin: catchAsync(async (req, res, next) => {
    const emergencyAlertsAdmin = await EmergencyAlertsAdmin.create(req.body);

    res.status(200).json({
      status: 'success',
      data: emergencyAlertsAdmin,
    });
  }),
  getAllEmergencyAlertsAdmins: catchAsync(async (req, res, next) => {
    const emergencyAlertsAdmins = await EmergencyAlertsAdmin.findAll();

    res.status(200).json({
      status: 'success',
      data: emergencyAlertsAdmins,
    });
  }),
  getEmergencyAlertsAdmin: catchAsync(async (req, res, next) => {
    const emergencyAlertsAdmin = await EmergencyAlertsAdmin.findByPk(req.params.id);

    if (!emergencyAlertsAdmin) return next(new AppError('No hospital admin exists with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: emergencyAlertsAdmin,
    });
  }),
  approveHospitalAdmin: catchAsync(async (req, res, next) => {}),
  approvePoliceAdmin: catchAsync(async (req, res, next) => {}),
};
