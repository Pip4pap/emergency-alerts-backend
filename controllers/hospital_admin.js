const { HospitalAdmin, Hospital } = require('./../models/sequelize');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

module.exports = {
  addHospitalAdmin: catchAsync(async (req, res, next) => {
    const hospitalAdmin = await HospitalAdmin.create(req.body);

    res.status(200).json({ status: 'success', data: hospitalAdmin });
  }),
  getAllHospitalAdmins: catchAsync(async (req, res, next) => {
    const hospitalAdmins = await HospitalAdmin.findAll({
      include: [
        {
          model: Hospital,
          attributes: ['id', 'hospitalName'],
        },
      ],
    });

    res.status(200).json({ status: 'success', data: hospitalAdmins });
  }),
  getLoggedInHospitalAdmin: catchAsync(async (req, res, next) => {
    const hospitalAdmin = await HospitalAdmin.findByPk(req.user.ID);

    if (!hospitalAdmin) return next(new AppError('No hospital admin exists with that ID', 404));

    res.status(200).json({ status: 'success', data: hospitalAdmin });
  }),
  getMyHospital: catchAsync(async (req, res, next) => {
    const hospitalAdminHospital = await req.user.getHospital();

    res.status(200).json({ status: 'success', data: hospitalAdminHospital });
  }),
  addMetoHospital: catchAsync(async (req, res, next) => {
    let hospital = await Hospital.findOne({
      where: {
        hospitalName: req.body.hospitalName,
      },
    });

    if (!hospital) {
      hospital = await Hospital.create(req.body);
    }
    await hospital.addHospitalAdmin(req.user, { validate: false });
    res.status(200).json({ status: 'success', data: hospital });
  }),
  approveHospitalAdmin: catchAsync(async (req, res, next) => {
    let hospitalAdmin = await HospitalAdmin.findOne({
      where: {
        ID: req.body.ID,
      },
    });
    hospitalAdmin.verificationStatus = 'Approved';
    hospitalAdmin.verified = true;
    // HospitalAdmin.removeHook('afterValidate');
    await hospitalAdmin.save({ validate: false });
    res.status(200).json({ status: 'success', message: 'You have approved admin to hospital' });
  }),
  denyHospitalAdmin: catchAsync(async (req, res, next) => {
    let hospitalAdmin = await HospitalAdmin.findOne({
      where: {
        ID: req.body.ID,
      },
    });
    hospitalAdmin.verificationStatus = 'Denied';
    hospitalAdmin.verified = true;
    // HospitalAdmin.removeHook('afterValidate');
    await hospitalAdmin.save({ validate: false });
    res.status(200).json({ status: 'success', message: 'You have denied admin to hospital' });
  }),
  getAdminHospital: catchAsync(async (req, res, next) => {
    const hospitalAdmin = await HospitalAdmin.findByPk(req.params.id);
    const hospitalAdminHospital = await hospitalAdmin.getHospital();

    if (!hospitalAdmin) return next(new AppError(`No hospital Admin with ID ${req.params.id} exists`, 404));

    res.status(200).json({ status: 'success', data: hospitalAdminHospital });
  }),
  addToHospital: catchAsync(async (req, res, next) => {
    const hospitalAdmin = await HospitalAdmin.findByPk(req.params.id);
    let hospital = await Hospital.findOne({
      where: {
        hospitalName: req.body.hospitalName,
      },
    });

    if (!hospital) {
      hospital = await hospital.create(req.body);
    }
    HospitalAdmin.removeHook('afterValidate');
    await hospital.addHospitalAdmin(hospitalAdmin, { validate: false });
    res.status(200).json({ status: 'success', data: hospital });
  }),
};
