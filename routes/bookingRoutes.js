const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authcontroller');
const bookController = require('./../controllers/bookcontroller');
const factory = require('./../controllers/handlerFactory');
const Router = express.Router();
Router.use(authController.protect);
Router.get(
  '/checkout-session/:tourid',

  bookController.getCheckOutSession
);
Router.use(authController.restrictTo('admin', 'guide'));
Router.route('/')
  .get(bookController.getAllBookings)
  .post(bookController.createBooking);
Router.route('/:id')
  .get(bookController.getoneBooking)
  .patch(bookController.updateBooking)
  .delete(bookController.deleteBooking);
module.exports = Router;
