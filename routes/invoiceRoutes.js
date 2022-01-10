const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authController = require('../controllers/authController');

router
    .route('/')
    .post(authController.protect, invoiceController.createInvoice)
    .get(authController.protect, invoiceController.getInvoice)
    .put(authController.protect, invoiceController.updateInvoice)

router
    .route('/:id')
    .delete(authController.protect, authController.restrictTo('admin', 'super-admin'), invoiceController.deleteInvoice)
    .get(authController.protect, invoiceController.searchInvoice)



module.exports = router;