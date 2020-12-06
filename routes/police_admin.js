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

router.route('/police').get(controller.getMyPolice).patch(controller.addMetoPolice);

// This routes should be restricted to only the Emergency-ALerts-Admin
router.route('/').get(controller.getAllPoliceAdmins).post(controller.addPoliceAdmin);
router.route('/crashes').get(controller.getPoliceCrashes)
router.patch('/approve', controller.approvePoliceAdmin);
router.patch('/deny', controller.denyPoliceAdmin);
router.route('/:id/police').get(controller.getAdminPolice).patch(controller.addToPolice);
router.get('/me', controller.getLoggedInPoliceAdmin);
module.exports = router;
