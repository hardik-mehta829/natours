// const fs = require('fs');
// const express = require('express');
// const Tour = require('./../models/tourmodel');
// // const tours = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// // );
// // exports.checkid = function (req, res, next, val) {
// //   console.log(`Tour with id :${val}`);
// //   if (val > tours.length) {
// //     return res.status(404).json({
// //       status: 'failure',
// //       message: 'Invalid id',
// //     });
// //   }
// //   next();
// // };
// // exports.checkbody = (req, res, next) => {
// //   if (!req.body.name || !req.body.price) {
// //     return res.status(400).json({
// //       status: 'fail',
// //       message: 'Invalid data',
// //     });
// //   }
// //   next();
// // };
// exports.getalltours = async function (req, res) {
//   try {
//     const queryobj = { ...req.query };
//     // const excluded = [sort, limit, page, fields];
//     // excluded.forEach((el) => delete queryobj.el);
//     delete queryobj.sort;
//     delete queryobj.limit;
//     delete queryobj.page;
//     delete queryobj.fields;
//     // {duration:5,difficulty:{$gte:10}}
//     // console.log(req.query.sort);
//     let querystr = JSON.stringify(queryobj);

//     querystr = querystr.replace(/\b(gte)\b/g, '$gte');
//     querystr = querystr.replace(/\b(lte)\b/g, '$lte');
//     querystr = querystr.replace(/\b(lt)\b/g, '$lt');
//     querystr = querystr.replace(/\b(gt)\b/g, '$gt');

//     // querystr = querystr.replace(/\b(lt||lte||gt||gte)\b/g, (match) => {
//     //   console.log(match);
//     //   return `$${match}`;
//     // });
//     console.log(JSON.parse(querystr));
//     let queryd = Tour.find(JSON.parse(querystr));
//     console.log(req.query.sort);
//     if (req.query.sort) {
//       const sortby = req.query.sort.split(',').join(' ');
//       console.log(sortby);
//       queryd = queryd.sort(sortby);
//     } else {
//       queryd = queryd.sort('createdAt');
//     }
//     if (req.query.fields) {
//       console.log(req.query.fields);
//       const fields = req.query.fields.split(',').join(' ');
//       queryd = queryd.select(fields);
//     } else {
//       queryd = queryd.select('-description');
//     }
//     const tours = await queryd;
//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       // RequestedAt: req.requesttime,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Failure',
//       message: err,
//     });
//   }
// };
// exports.createtour = async function (req, res) {
//   try {
//     const newtour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newtour,
//       },
//     });
//     // const newid = tours[tours.length - 1].id + 1;
//     // const newtour = Object.assign({ id: newid }, req.body);
//     // tours.push(newtour);
//     // fs.writeFile(
//     //   `${__dirname}/../dev-data/data/tours-simple.json`,
//     //   JSON.stringify(tours),
//     // (err) => {
//     //   res.status(201).json({
//     //     status: 'success',
//     // data: {
//     //   tour: newtour,
//     // },
//     // });
//     //   }
//     // );
//   } catch (err) {
//     res.status(404).json({
//       status: 'Failure',
//       message: err,
//     });
//   }
// };
// exports.singletour = async function (req, res) {
//   // const tour = tours.find((el) => el.id === Number(req.params.id));
//   try {
//     const tour = await Tour.findById(req.params.id);
//     res.status(200).json({
//       status: 'success',
//       // RequestedAt: req.requesttime,
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Failure',
//       message: err,
//     });
//   }
// };
// exports.updatetour = async function (req, res) {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: 'success',
//       tour,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Failure',
//       data: {
//         message: err,
//       },
//     });
//   }
//   // const tour = tours.find((el) => el.id === Number(req.params.id));
// };
// exports.deletetour = async function (req, res) {
//   // const tour = tours.find((el) => el.id === Number(req.params.id));
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       status: 'success',
//       data: 'null',
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Failure',
//       data: {
//         message: err,
//       },
//     });
//   }
// };
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const express = require('express');
const Tour = require('./../models/tourmodel');
const catchasync = require('./../utils/catchasync');
const apperror = require('./../utils/apperror');
const apifeatures = require('./../utils/apifeatures');
const factory = require('./../controllers/handlerFactory');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
// exports.checkid = (req, res, next, val) => {
//   if (Number(req.params.id) > tours.length) {
//     return res.status(404).json({
//       status: 'Failure',
//       message: 'Invalid id',
//     });
//   }
//   console.log(`Tour with id :${val}`);
//   next();
// };
// exports.checkbody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'Fail',
//       data: {
//         message: 'Missing price or name',
//       },
//     });
//   }
//   next();
// };
const multerStorage = multer.memoryStorage();
const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new apperror('Please upload only images', 400), 'false');
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerfilter,
});
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
exports.resizeTourImages = catchasync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});
exports.aliastours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};
exports.getalltours = factory.getAll(Tour);
// exports.getalltours = catchasync(async (req, res, next) => {
//   console.log(req.query);
//   // const queryobj = { ...req.query };
//   // const excludedfields = ['sort', 'limit', 'page', 'fields'];
//   // excludedfields.forEach((el) => delete queryobj[el]);

//   // let querystr = JSON.stringify(queryobj);
//   // querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
//   // console.log(JSON.parse(querystr));
//   // let query = Tour.find(JSON.parse(querystr));
//   //sorting
//   // if (req.query.sort) {
//   //   const sortby = req.query.sort.split(',').join(' ');
//   //   console.log(sortby);
//   //   query = query.sort(sortby);
//   // } else {
//   //   query = query.sort('-createdat');
//   // }
//   //fields
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   query = query.select(fields);
//   // } else {
//   //   // query = query.select('-__v');
//   // }
//   //pagination
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // console.log(skip);
//   // query = query.skip(skip).limit(limit);
//   // if (req.query.page) {
//   //   const numtours = await Tour.countDocuments();
//   //   if (skip >= numtours) throw new Error('The page does not exist');
//   // }
//   const features = new apifeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitfields()
//     .paginate();
//   const tours = await features.query;
//   res.status(200).json({
//     status: 'Success',
//     results: tours.length,

//     data: {
//       tours,
//     },
//   });
// });
exports.singletour = factory.getOne(Tour, { path: 'reviews' });

// const id = Number(req.params.id);
// const tour = tours.find((el) => el.id === id);

exports.updatetour = catchasync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new apperror('Tour not found', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
  // const id = Number(req.params.id);
  // const tour = tours.find((el) => el.id === id);
});
exports.deletetour = factory.deleteOne(Tour);
// exports.deletetour = catchasync(async (req, res, next) => {
//   // const id = Number(req.params.id);
//   // const tour = tours.find((el) => el.id === id);

//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new apperror('Tour not found', 404));
//   }
//   res.status(204).json({
//     status: 'Deleted Successfully',
//   });
// });
exports.createtour = factory.createOne(Tour);
// /tours-within/233/center/34.111745,-118.113491/unit/:unit
exports.getToursWithin = catchasync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) next(new apperror('The co=ordinates are not correct', 404));
  console.log(distance, lat, lng, unit);
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
exports.getDistances = catchasync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  // const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) next(new apperror('The co=ordinates are not correct', 404));
  console.log(lat, lng, unit);
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      distances,
    },
  });
});
exports.getstatistics = catchasync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numtours: { $sum: 1 },
        numratings: { $sum: '$ratingsQuantity' },
        avgratings: { $avg: '$ratingsAverage' },
        avgprice: { $avg: '$price' },
        maxprice: { $max: '$price' },
        minprice: { $min: '$price' },
      },
    },
    {
      $sort: {
        avgprice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});
exports.getmonthlyplan = catchasync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numtours: {
          $sum: 1,
        },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numtours: -1,
      },
    },
    // {
    //   $limit: 2,
    // },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});
