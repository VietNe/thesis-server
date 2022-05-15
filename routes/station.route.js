const express = require('express');
const stationController = require('../controllers/station.controller');
const authController = require('./../controllers/auth.controller');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
//userr
router.use(authController.restrictTo('admin'));
router.post('/post', stationController.setStationData);
router.post('/predict', stationController.predict);

router.get('/', stationController.getAllStation);
router.get('/:stationId', stationController.getStationById);

module.exports = router;
