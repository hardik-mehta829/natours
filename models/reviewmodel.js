const mongoose = require('mongoose');
const Tourrev = require('./tourmodel');
const { calcaverageratings } = require('../controllers/handlerFactory');
// const userModel = require('./usermodel');
// const factory = require('./../controllers/handlerFactory');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      // required: [true, 'A review is necessary'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      // required: [true, 'A rating must be provided'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tourrev',
      // required: [true, 'A reference to tour is mandatory'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'userModel',
      // required: [true, 'A reference to user is mandatory'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourid) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourid,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        averageRatings: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);

  await Tourrev.findByIdAndUpdate(tourid, {
    ratingsAverage: stats[0].averageRatings,
    ratingsQuantity: stats[0].nRatings,
  });
};
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const reviewmodel = mongoose.model('reviewmodel', reviewSchema);
module.exports = reviewmodel;
// exports.reviewmodel = reviewmodel;
