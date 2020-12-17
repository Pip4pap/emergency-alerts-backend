const express = require('express');
const controller = require('./../controllers/hospital_admin');
const appAuthController = require('./../auth/userAuthController');
const appAuthProtector = require('./../auth/userAuthProtector');
const {HospitalAdmin} = require('./../models/sequelize');

// creates an auth controller for the hospital admin
const HospitalAdminAuth = new appAuthController(HospitalAdmin);

const router = express.Router({mergeParams: true});


router.post('/signup', HospitalAdminAuth.signup());
router.post('/login', HospitalAdminAuth.login());
router.get('/logout', HospitalAdminAuth.logout());
router.patch('/forgotPassword', HospitalAdminAuth.forgotPassword());
router.patch('/resetPassword', HospitalAdminAuth.resetPassword());

router.use(appAuthProtector());

router.route('/hospital').get(HospitalAdminAuth.restrictTo('HospitalAdmin'), controller.getMyHospital).patch(HospitalAdminAuth.restrictTo('HospitalAdmin'), controller.addMetoHospital);

// This routes should be restricted to only the Emergency-ALerts-Admin
router.route('/').get(HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAllHospitalAdmins).post(HospitalAdminAuth.restrictTo('HospitalAdmin'), controller.addHospitalAdmin);
router.route('/crashes').get(HospitalAdminAuth.restrictTo('HospitalAdmin'), controller.getHospitalCrashes)
// router.get('/allPendingHospitalAdmins', controller.getAllPendingHospitalAdmins);
router.patch('/approve', HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.approveHospitalAdmin);
router.patch('/deny', HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.denyHospitalAdmin);
router.route('/:id/hospital').get(HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAdminHospital).patch(HospitalAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.addToHospital);
router.get('/me', HospitalAdminAuth.restrictTo('HospitalAdmin'), controller.getLoggedInHospitalAdmin);
module.exports = router;
