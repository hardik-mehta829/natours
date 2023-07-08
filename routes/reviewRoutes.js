const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authcontroller');
const factory = require('./../controllers/handlerFactory');
const Router = express.Router({ mergeParams: true });
Router.use(authController.protect);
Router.route('/').get(
  authController.restrictTo('user'),
  reviewController.getallreviews
);
Router.route('/').post(
  authController.restrictTo('user'),
  reviewController.setTourid,
  reviewController.createReview
);
Router.route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .get(reviewController.singleReview);
module.exports = Router;
