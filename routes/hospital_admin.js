const express = require('express');
const controller = require('./../controllers/hospital_admin');
const appAuthController = require('./../auth/userAuthController');
const appAuthProtector = require('./../auth/userAuthProtector');
const {HospitalAdmin} = require('./../models/sequelize');

// creates an auth controller for the hospital admin
const hospitalAdminAuth = new appAuthController(HospitalAdmin);

const router = express.Router({mergeParams: true});

router.post('/signup', hospitalAdminAuth.signup());
router.post('/login', hospitalAdminAuth.login());
router.get('/logout', hospitalAdminAuth.logout());
router.patch('/forgotPassword', hospitalAdminAuth.forgotPassword());
router.patch('/resetPassword', hospitalAdminAuth.resetPassword());

router.use(appAuthProtector());

router.route('/hospital').get(controller.getMyHospital).patch(controller.addMetoHospital);

// This routes should be restricted to only the Emergency-ALerts-Admin
router.route('/').get(controller.getAllHospitalAdmins).post(controller.addHospitalAdmin);
// router.get('/allPendingHospitalAdmins', controller.getAllPendingHospitalAdmins);
router.patch('/approve', controller.approveHospitalAdmin);
router.patch('/deny', controller.denyHospitalAdmin);
router.route('/:id/hospital').get(controller.getAdminHospital).patch(controller.addToHospital);
router.get('/:id', controller.getHospitalAdmin);
module.exports = router;
