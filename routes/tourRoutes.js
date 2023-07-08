const fs = require('fs');
const express = require('express');

const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authcontroller');

const reviewRouter = require('./../routes/reviewRoutes');
// Router.param('id', tourController.checkid);
const Router = express.Router();
Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(
  tourController.getToursWithin
);
Router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
Router.use('/:tourid/reviews', reviewRouter);

Router.route('/get-stats').get(tourController.getstatistics);

Router.route('/busy-month/:year').get(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getmonthlyplan
);

Router.route('/top-5-cheap').get(
  tourController.aliastours,
  tourController.getalltours
);

Router.route('/')
  .get(tourController.getalltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createtour
  );

Router.route('/:id')
  .get(tourController.singletour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updatetour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deletetour
  );

// Router.route('/:tourid/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview
// );

module.exports = Router;
