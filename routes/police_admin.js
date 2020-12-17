const express = require('express');
const controller = require('./../controllers/police_admin');
const appAuthController = require('./../auth/userAuthController');
const appAuthProtector = require('./../auth/userAuthProtector');
const {PoliceAdmin} = require('./../models/sequelize');

// creates an auth controller for the police admin
const policeAdminAuth = new appAuthController(PoliceAdmin);

const router = express.Router({mergeParams: true});

router.post('/signup', policeAdminAuth.signup());
router.post('/login', policeAdminAuth.login());
router.get('/logout', policeAdminAuth.logout());
router.patch('/forgotPassword', policeAdminAuth.forgotPassword());
router.patch('/resetPassword', policeAdminAuth.resetPassword());

router.use(appAuthProtector());

router.route('/police').get(policeAdminAuth.restrictTo('PoliceAdmin'), controller.getMyPolice).patch(policeAdminAuth.restrictTo('PoliceAdmin'), controller.addMetoPolice);

// This routes should be restricted to only the Emergency-ALerts-Admin
router.route('/').get(policeAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAllPoliceAdmins).post(policeAdminAuth.restrictTo('PoliceAdmin'), controller.addPoliceAdmin);
router.route('/crashes').get(policeAdminAuth.restrictTo('PoliceAdmin'), controller.getPoliceCrashes)
router.patch('/approve', policeAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.approvePoliceAdmin);
router.patch('/deny', policeAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.denyPoliceAdmin);
router.route('/:id/police').get(policeAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.getAdminPolice).patch(policeAdminAuth.restrictTo('EmergencyAlertsAdmin'), controller.addToPolice);
router.get('/me', policeAdminAuth.restrictTo('PoliceAdmin'), controller.getLoggedInPoliceAdmin);
module.exports = router;
