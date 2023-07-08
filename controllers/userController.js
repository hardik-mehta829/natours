const catchasync = require('./../utils/catchasync');
const userModel = require('./../models/usermodel');
const apperror = require('../utils/apperror');
const factory = require('./../controllers/handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });
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
exports.upLoadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchasync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
const filterobj = function (obj, ...allowedfields) {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) {
      newobj[el] = obj[el];
    }
  });
  return newobj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
exports.getallusers = factory.getAll(userModel);
// exports.getallusers = catchasync(async function (req, res) {
//   const users = await userModel.find();
//   res.status(200).json({
//     status: 'Success',
//     results: users.length,

//     data: {
//       users,
//     },
//   });
// });
exports.updateMe = catchasync(async function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new apperror('Cannot update the password from this route', 400)
    );
  }
  const Obj = filterobj(req.body, 'name', 'email');
  if (req.file) Obj.photo = req.file.filename;
  const updateduser = await userModel.findByIdAndUpdate(req.user._id, Obj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updateduser,
    },
  });
});
exports.deleteMe = catchasync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
exports.singleuser = factory.getOne(userModel);
exports.createuser = function (req, res) {
  res.status(500).json({
    status: 'Internal server error',
    data: {
      message: 'No user can be created ',
    },
  });
};
exports.updateuser = factory.updateOne(userModel);
exports.deleteuser = factory.deleteOne(userModel);
