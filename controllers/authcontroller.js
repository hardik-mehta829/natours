const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const Usermodel = require('./../models/usermodel');
const catchasync = require('./../utils/catchasync');
const apperror = require('./../utils/apperror');
const Email = require(`./../utils/email`);
const signin = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES,
  });
};

const createToken = (user, statusCode, res) => {
  const token = signin(user._id);
  const cookieoptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV.trim() === 'production') cookieoptions.secure = true;
  res.cookie('jwt', token, cookieoptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchasync(async (req, res, next) => {
  const newuser = await Usermodel.create(
    req.body
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm,
  );
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newuser, url).sendWelcome();
  createToken(newuser, 201, res);
  // const token = signin(newuser._id);
  // res.status(201).json({
  //   status: 'Success',
  //   token,
  //   data: {
  //     newuser,
  //   },
  // });
});
exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body;
  //Check if email,password exists
  if (!email || !password)
    return next(new apperror('Please provide email and password', 400));
  //Check if user exists and password is correct
  const user = await Usermodel.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new apperror('Invalid email or password', 401));
  }
  createToken(user, 200, res);
  // const token = signin(user._id);
  // res.status(200).json({
  //   status: 'Success',
  //   token,
  // });
});
exports.loggedin = async (req, res, next) => {
  //
  let token;
  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
      const currentuser = await Usermodel.findById(decoded.id);

      if (!currentuser) {
        return next();
      }

      if (currentuser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = currentuser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
exports.LoggedOut = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
exports.protect = catchasync(async (req, res, next) => {
  //
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new apperror('You are not logged in', 401));
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
  const currentuser = await Usermodel.findById(decoded.id);

  if (!currentuser) {
    console.log('No user');
    return next(new apperror('User of this token no longer exist', 401));
  }
  // console.log(currentuser.changedPasswordAfter(decoded.iat));
  // const checker = currentuser.changedPasswordAfter(decoded.iat);

  if (currentuser.changedPasswordAfter(decoded.iat)) {
    return next(
      new apperror(
        'The password is changed after the token has been issued',
        401
      )
    );
  }
  req.user = currentuser;
  res.locals.user = currentuser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apperror('You do not have the permission to delete the tour', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchasync(async (req, res, next) => {
  //Get user from the email id
  const user = await Usermodel.findOne({ email: req.body.email });
  if (!user)
    return next(new apperror('Please provide a valid email address', 400));
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to ${resetUrl}. \n If you did'nt forgot the password please ignore this email`;
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your reset token(Valid only for 10 min)',
    //   message,
    // });
    // console.log('Logged after');

    await new Email(user, resetUrl).sendpasswordreset();
    res.status(200).json({
      status: 'Success',
      message: 'Token sent to the email successfully',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new apperror(
        'There was an error sending the email.Please try again later'
      ),
      500
    );
  }
});
exports.resetPassword = catchasync(async (req, res, next) => {
  //Get user from the token
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await Usermodel.findOne({
    passwordResetToken: resetToken,
    passwordExpiresIn: { $gt: Date.now() },
  });
  if (!user)
    return next(new apperror('Token is invalid or already expired', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordExpiresIn = undefined;
  await user.save();
  //Log in the user
  createToken(user, 200, res);
  // const token = signin(user._id);
  // res.status(200).json({
  //   status: 'Success',
  //   token,
  // });
});
exports.updatePassword = catchasync(async (req, res, next) => {
  //Get user from the collection
  const user = await Usermodel.findById(req.user._id).select('+password');
  //Check if the posted password is correct
  console.log(req.body.passwordCurrent);
  console.log(req.body.password);
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new apperror('The password is not correct', 400));
  //Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createToken(user, 200, res);
});
