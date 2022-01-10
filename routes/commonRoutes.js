const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const common = require('../controllers/commonController');

router
    .route('/count/:model')
    .get(authController.protect, common.getCount)

router
    .route('/tax')
    .get(authController.protect, common.getTax)
    .post(authController.protect, common.createTax)

router
    .route('/unit')
    .get(authController.protect, common.getUnit)
    .post(authController.protect, common.createUnit)

router
    .route('/clientNames')
    .get(authController.protect, common.getClientName)

router
    .route('/exportReport/:model')
    .get(common.exportExcelReport)
    .post(common.exportExcelReportToDB)

module.exports = router;