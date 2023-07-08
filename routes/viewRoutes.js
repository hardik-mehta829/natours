const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authcontroller');
const bookController = require('./../controllers/bookcontroller');
const router = express.Router();
router.get(
  '/',
  bookController.createBookingCheckOut,
  authController.loggedin,
  viewController.getOverview
);
router.get('/tour/:slug', authController.loggedin, viewController.getTour);
router.get('/login', authController.loggedin, viewController.login);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.UpdateUserData
);
module.exports = router;
