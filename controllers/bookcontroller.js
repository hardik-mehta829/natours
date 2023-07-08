const stripe = require('stripe')(
  'sk_test_51NPhPxSFtNwjVDe3OEY19wJwnshk7rb2dnTjjTHlKwO6gFJtatlFMdsc566iDJUKcdmBhKTxxasitztpe8LG5yrk00oXUkCMqS'
);
const Tour = require('./../models/tourmodel');
const Booking = require('./../models/bookingModel');
const catchasync = require('./../utils/catchasync');
const apperror = require('./../utils/apperror');
const apifeatures = require('./../utils/apifeatures');
const factory = require('./../controllers/handlerFactory');

exports.getCheckOutSession = catchasync(async (req, res, next) => {
  // 1 Find the tour
  const tour = await Tour.findById(req.params.tourid);
  // 2 Create a checkout session

  const session = await stripe.checkout.sessions.create({
    // images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
    // description: tour.summary,

    line_items: [
      {
        price_data: {
          currency: 'usd',

          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourid
    }&user=${req.user._id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourid,
  });

  //3 Send the session
  res.status(200).json({
    status: 'success',
    session,
  });
});
exports.createBookingCheckOut = async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
  next();
};
exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getoneBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
