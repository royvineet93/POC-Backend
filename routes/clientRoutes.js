const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');

router
  .route('/')
  .post(authController.protect,clientController.createclient)
  .get(authController.protect,clientController.getclient)
  .put(authController.protect,clientController.updateclient)

router
  .route('/:id')
  .delete(authController.protect,authController.restrictTo('admin', 'super-admin'),clientController.deleteclient)
  .get(authController.protect,clientController.searchclient)



module.exports = router;