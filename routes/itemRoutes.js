const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authController = require('../controllers/authController');

router
    .route('/')
    .get(authController.protect, itemController.getItem)
    .post(authController.protect, itemController.createItem)
    .put(authController.protect, itemController.updateItem);

router
    .route('/:id')
    .get(authController.protect, itemController.getItem)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'super-admin'),
        itemController.deleteItem
    );

module.exports = router;