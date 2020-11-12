const {PoliceAdmin, Police} = require('./../models/sequelize');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

module.exports = {
    addPoliceAdmin: catchAsync(async (req, res, next) => {
        const policeAdmin = await PoliceAdmin.create(req.body);
        res.status(200).json({status: 'success', data: policeAdmin});
    }),
    getAllPoliceAdmins: catchAsync(async (req, res, next) => {
        const policeAdmins = await PoliceAdmin.findAll({
            include: [
                {
                    model: Police,
                    as: "Police",
                    attributes: ['id', 'policeName']
                },
            ]
        });
        res.status(200).json({status: 'success', data: policeAdmins});
    }),
    getPoliceCrashes: catchAsync(async (req, res, next) => {
        let police = await Police.findByPk(req.user.PoliceID)
        let crashes = await police.getCrashes();
        res.status(200).json({status: 'success', data: crashes})
    }),
    getLoggedInPoliceAdmin: catchAsync(async (req, res, next) => {
        const policeAdmin = await PoliceAdmin.findByPk(req.user.ID);
        if (! policeAdmin) {
            return next(new AppError('No police admin exists with that ID', 404));
        }
        res.status(200).json({status: 'success', data: policeAdmin});
    }),
    getMyPolice: catchAsync(async (req, res, next) => {
        const policeAdmin = req.user
        const police = await policeAdmin.getPolice()

        if (! police) {
            police = await Police.create(req.body);
        }
        res.status(200).json({status: 'success', data: police});
    }),
    approvePoliceAdmin: catchAsync(async (req, res, next) => {
        let policeAdmin = await PoliceAdmin.findOne({
            where: {
                ID: req.body.ID
            }
        });
        policeAdmin.verificationStatus = 'Approved';
        policeAdmin.verified = true;
        await policeAdmin.save({validate: false});
        res.status(200).json({status: 'success', message: 'You have approved admin to police station'});
    }),
    denyPoliceAdmin: catchAsync(async (req, res, next) => {
        let policeAdmin = await PoliceAdmin.findOne({
            where: {
                ID: req.body.ID
            }
        });
        policeAdmin.verificationStatus = 'Denied';
        policeAdmin.verified = true;
        await policeAdmin.save({validate: false});
        res.status(200).json({status: 'success', message: 'You have denied admin to police station'});
    }),
    // getAdminPolice: catchAsync(async (req, res, next) => {
    //     const policeAdmin = await PoliceAdmin.findByPk(req.params.id);
    //     console.log(policeAdmin)
    //     const policeAdminPolice = await policeAdmin.getPolice();
    //     res.status(200).json({status: 'success', data: policeAdminPolice});
    // }),
    addMetoPolice: catchAsync(async (req, res, next) => {
        let police = await Police.findOne({
            where: {
                policePlaceID: req.body.policePlaceID
            }
        });
        if (! police) {
            police = await Police.create(req.body);
        }
        await police.addPoliceAdmin(req.user, {validate: false});
        res.status(200).json({status: 'success', data: police});
    }),
    getAdminPolice: catchAsync(async (req, res, next) => {
        const policeAdmin = await PoliceAdmin.findByPk(req.params.id);
        if (! policeAdmin) {
            return next(new AppError(`No police Admin with ID ${
                req.params.id
            } exists`, 404));
        }
        const policeAdminPolice = await policeAdmin.getPolice();
        res.status(200).json({status: 'success', data: policeAdminPolice});
    }),
    addToPolice: catchAsync(async (req, res, next) => {
        const policeAdmin = await PoliceAdmin.findByPk(req.params.id);
        let police = await Police.findOne({
            where: {
                ID: req.user.PoliceID
            }
        });

        if (! police) {
            police = await police.create(req.body);
        }
        PoliceAdmin.removeHook('afterValidate');
        await police.addpoliceAdmin(policeAdmin, {validate: false});
        res.status(200).json({status: 'success', data: police});
    })
};
