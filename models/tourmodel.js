// const mongoose = require('mongoose');
// const tourschema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     unique: true,
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//   },
//   pricediscount: Number,
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   duration: {
//     type: Number,
//     required: [true, 'Duration of tour must be specified'],
//   },
//   maxGroupSize: {
//     type: Number,
//     required: [true, 'Size of group should be specified'],
//   },
//   difficulty: {
//     type: String,
//     required: [true, 'Difficulty must be specified'],
//   },
//   ratingsQuantity: {
//     type: Number,
//     default: 0,
//   },
//   ratingsAverage: {
//     type: Number,
//     default: 4.5,
//   },
//   imageCover: {
//     type: String,
//     required: [true, 'Image cover must be present'],
//   },
//   images: [String],
//   summary: {
//     type: String,
//     trim: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//     select: false,
//   },
//   startDates: {
//     type: [Date],
//   },
// });
// const Tour = mongoose.model('Tour', tourschema);
// module.exports = Tour;
const mongoose = require('mongoose');
const validator = require('validator');
const userModel = require('./usermodel');
const { default: slugify } = require('slugify');
const slug = require('slugify');
const Tourschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [
        10,
        'A tour must have a name of length greater or equal to 10',
      ],
      maxlength: [40, 'A tour must have a name of length less or equal to 40'],
      // validate: [validator.isAlpha, 'A tour must contain only characters'],
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be either easy,medium or difficult',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'The rating should be greater or equal to 1'],
      max: [5, 'The rating should be less or equal to 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    pricediscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'The discount ({VALUE}) is not less than the price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      // required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdat: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'userModel',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
Tourschema.index({ price: 1, ratingsAverage: -1 });
Tourschema.index({ slug: 1 });
// Tourschema.index({ startLocation: '2dsphere' });
Tourschema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});
Tourschema.virtual('reviews', {
  ref: 'reviewmodel',
  foreignField: 'tour',
  localField: '_id',
});
Tourschema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

Tourschema.pre('save', async function (next) {
  const guidespromises = this.guides.map(
    async (id) => await userModel.findById(id)
  );
  const guides = await Promise.all(guidespromises);
  this.guides = guides;
  next();
});
Tourschema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'role _id name email photo',
  });
  next();
});
// Tourschema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
Tourschema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
Tourschema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds to execute`);

  next();
});
// Tourschema.pre('aggregate', function (next) {
//   console.log(this.pipeline());
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });
const Tourrev = mongoose.model('Tourrev', Tourschema);
module.exports = Tourrev;
