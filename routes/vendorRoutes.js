const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authController = require('../controllers/authController');

router
    .route('/')
    .post(authController.protect,vendorController.createVendor)
    .get(authController.protect,vendorController.getVendor)
    .put(authController.protect,vendorController.updateVendor)

router
    .route('/:id')
    .delete(authController.protect,vendorController.deleteVendor)
    .get(authController.protect,vendorController.searchclient);

module.exports = router;