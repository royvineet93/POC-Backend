const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

router
    .route('/')
    .post(authController.protect, paymentController.create);

module.exports = router;