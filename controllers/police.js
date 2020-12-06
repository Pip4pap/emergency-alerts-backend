const {Police} = require("./../models/sequelize");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

module.exports = {
    addPolice: catchAsync(async (req, res, next) => {
        police = await Police.create(req.body);

        res.status(201).json({status: "success", data: police});
    }),
    getAllPolices: catchAsync(async (req, res, next) => {
        polices = await Police.findAll();

        res.status(200).json({status: "success", data: polices});
    }),
    getPolice: catchAsync(async (req, res, next) => {
        police = await Police.findByPk(req.params.id);
        if (!police) {
            return next(new AppError("No police exists with such an ID", 404));
        }
        res.status(200).json({status: "success", data: police});
    }),
    addCrashToPolice: catchAsync(async (req, res, next) => {
        police = await Police.findByPk(req.params.id);
    })
};
