const reviewmodel = require('./../models/reviewmodel');
// const catchasync = require('./../utils/catchasync');
// const apperror = require('./../utils/apperror');
const factory = require('./../controllers/handlerFactory');

// exports.getallreviews = catchasync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourid) filter = { tour: req.params.tourid };
//   const Allreviews = await reviewmodel.find(filter);
//   if (!Allreviews) return next(new apperror('Reviews are not found', 404));
//   res.status(200).json({
//     status: 'Success',
//     results: Allreviews.length,
//     data: {
//       Allreviews,
//     },
//   });
// });
exports.setTourid = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.getallreviews = factory.getAll(reviewmodel);
exports.createReview = factory.createOne(reviewmodel);
exports.deleteReview = factory.deleteOne(reviewmodel);
exports.updateReview = factory.updateOne(reviewmodel);
exports.singleReview = factory.getOne(reviewmodel);
