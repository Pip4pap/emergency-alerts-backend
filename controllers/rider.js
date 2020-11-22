const {Rider, Crash} = require("./../models/sequelize");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

module.exports = {
    addRider: catchAsync(async (req, res, next) => {
        const rider = await Rider.create(req.body);

        res.status(201).json({status: "success", data: rider});
    }),
    getAllRiders: catchAsync(async (req, res, next) => {
        const riders = await Rider.findAll({
            include: [
                {
                    model: Crash,
                    attributes: [
                        'id',
                        'crashLatitude',
                        'crashLongitude',
                        'crashPlaceName',
                        'timestamp'
                    ]
                },
            ]
        });

        res.status(200).json({status: "success", data: riders});
    }),
    getRider: catchAsync(async (req, res, next) => {
        const rider = await Rider.findByPk(req.params.id);

        if (! rider) 
            return next(new AppError("No Rider exists with such an ID", 404));
        


        res.status(200).json({status: "success", data: rider});
    })
};
