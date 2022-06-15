const express = require('express');
const stationController = require('../controllers/station.controller');
const authController = require('./../controllers/auth.controller');

const router = express.Router();
router.get('/public', stationController.getAllStation);
router.get('/public/:stationId', stationController.getStationById);

// Protect all routes after this middleware
router.use(authController.protect);
router.get('/me', stationController.getStationByDeviceName);
router.get('/dashboard', stationController.getDashboard);
//admin
router.use(authController.restrictTo('admin'));
router.get('/', stationController.getAllStation);
router.get('/:stationId', stationController.getStationById);
router.post('/post', stationController.setStationData);
// router.post('/predict', stationController.predict);

module.exports = router;
