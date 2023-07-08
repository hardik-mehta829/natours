const catchasync = require('./../utils/catchasync');
const apperror = require('./../utils/apperror');
const apifeatures = require('./../utils/apifeatures');
// const { Model } = require('mongoose');
// const Tourrev = require('./../models/tourmodel');
// const reviewmodel = require('./../models/reviewmodel');
exports.getAll = (Model) =>
  catchasync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourid) filter = { tour: req.params.tourid };
    const features = new apifeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitfields()
      .paginate();
    // const docs = await features.query.explain();
    const docs = await features.query;
    res.status(200).json({
      status: 'Success',
      results: docs.length,

      data: {
        docs,
      },
    });
  });
exports.createOne = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });
exports.getOne = (Model, popOptions) =>
  catchasync(async (req, res, next) => {
    let query;
    query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new apperror('Document not found', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });
// exports.singletour = catchasync(async (req, res, next) => {
//   console.log('From here');
//   const tour = await Tour.findById(req.params.id).populate({ path: 'reviews' });
//   if (!tour) {
//     return next(new apperror('Tour not found', 404));
//   }
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tour,
//     },
//   });
exports.deleteOne = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new apperror('Doc not found', 404));
    }
    res.status(204).json({
      status: 'Deleted Successfully',
    });
  });

exports.updateOne = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new apperror('Document not found', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });
exports.calcaverageratings = (Model) =>
  catchasync(async (req, res, next) => {
    const stats = await Model.aggregate([
      {
        $match: {
          tour: req.body.tour,
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
    await Tourrev.findByIdAndUpdate(tour, {
      ratingsAverage: stats[0].averageRatings,
      ratingsQuantity: stats[0].nRatings,
    });
  });

// exports.calcAverageRatings =  (Model)=>
//   catchasync(async(req,res,next))=>{
//     const stats = await Model.aggregate([
//       {
//         $match: {
//           tour: req.body.tour,
//         },
//       },
//       {
//         $group: {
//           _id: '$tour',
//           nRatings: { $sum: 1 },
//           averageRatings: { $avg: '$rating' },
//         },
//       },
//     ]);
//     console.log(stats);

//     await Tourrev.findByIdAndUpdate(
//       tour,
//       {
//         ratingsAverage: stats[0].averageRatings,
//         ratingsQuantity: stats[0].nRatings,
//       }
//     );
//   }
