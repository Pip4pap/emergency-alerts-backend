const express = require('express');
const controller = require('./../controllers/admin');
const appAuthController = require('./../auth/userAuthController');
const appAuthProtector = require('./../auth/userAuthProtector');
const { EmergencyAlertsAdmin } = require('./../models/sequelize');

//creates an auth controller for the hospital admin
const EmergencyAlertsAdminAuth = new appAuthController(EmergencyAlertsAdmin);

const router = express.Router({ mergeParams: true });

router.post('/signup', EmergencyAlertsAdminAuth.signup());
router.post('/login', EmergencyAlertsAdminAuth.login());
router.get('/logout', EmergencyAlertsAdminAuth.logout());
router.patch('/forgotPassword', EmergencyAlertsAdminAuth.forgotPassword());
router.patch('/resetPassword/:token', EmergencyAlertsAdminAuth.resetPassword());

router.use(appAuthProtector());

router.route('/').get(controller.getAllEmergencyAlertsAdmins).post(controller.addEmergencyAlertsAdmin);
router.get('/approveHospitalAdmin', controller.approveHospitalAdmin);
router.get('/approvePoliceAdmin', controller.approveHospitalAdmin);

router.get('/:id', controller.getEmergencyAlertsAdmin);
module.exports = router;
