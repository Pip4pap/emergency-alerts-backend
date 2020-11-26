const AppError = require('./../utils/appError');
const {promisfy} = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const {HospitalAdmin, PoliceAdmin, EmergencyAlertsAdmin, Rider} = require('./../models/sequelize');

module.exports = () => {
    return catchAsync(async (req, res, next) => { // Step1: Getting the token;
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (! token) {
            return next(new AppError('You are not logged in, Please log in to gain access', 401));
        }

        // Step2: Verify Token sent
        let decoded;
        try { // TODO: Will consider to change this line and promisify it if it doesnot work.
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return next(new AppError('Invalid token, Please log in to gain access', 401));
        }

        // Step3 Check if the user still exists
        let currentUser;
        if (decoded.tableName === 'HospitalAdmin') {
            currentUser = await HospitalAdmin.findByPk(decoded.id);
        } else if (decoded.tableName === 'EmergencyAlertsAdmin') {
            currentUser = await EmergencyAlertsAdmin.findByPk(decoded.id);
        } else if (decoded.tableName === 'PoliceAdmin') {
            currentUser = await PoliceAdmin.findByPk(decoded.id);
        } else if (decoded.tableName === 'Rider') {
            currentUser = await Rider.findByPk(decoded.id);
        }

        if (! currentUser) {
            return next('The user with this token nolonger exists', 404);
        }

        // Step4: Check if the password has not changed after token was issued
        if (currentUser.isPasswordChangedAfterTokenIssued(decoded.iat)) {
            return next(new AppError('User recently changed password,Please log in again', 401));
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    });
};
