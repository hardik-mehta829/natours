const catchasync = require('../utils/catchasync');
const Tour = require('./../models/tourmodel');
const Booking = require('./../models/bookingModel');
const usermodel = require('./../models/usermodel');
const AppError = require(`./../utils/apperror`);
exports.getOverview = catchasync(async (req, res, next) => {
  const tours = await Tour.find();
  console.log(tours.length);
  res.status(200).render('overview', {
    tours,
  });
});
exports.getTour = catchasync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) return next(new AppError('There is no tour with this name', 404));
  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});
exports.login = catchasync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login page',
  });
});
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
exports.getMyTours = catchasync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourids = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourids } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
exports.UpdateUserData = catchasync(async (req, res) => {
  const Updateduser = await usermodel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: Updateduser,
  });
});
