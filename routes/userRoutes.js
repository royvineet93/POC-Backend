const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.put('/resetPassword/:token', authController.resetPassword);
router.get('/verifyUser/:token',authController.signUpVerification);

router.put(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.put(
  '/updateCurrentUser',
  authController.protect,
  userController.updateCurrentUserData
);

router.delete(
  '/deleteCurrentUser',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'), 
  userController.deleteCurrentUser
);

router
  .route('/')
  .get(authController.protect,userController.getAllUsers)
  .post(authController.protect,userController.createUser);

router
  .route('/:id')
  .get(authController.protect,userController.getUser)
  .put(authController.protect,userController.updateUser);

module.exports = router;
