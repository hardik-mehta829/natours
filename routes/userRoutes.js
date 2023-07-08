const fs = require('fs');
const express = require('express');
const userController = require('./../controllers/userController');
const authcontroller = require('./../controllers/authcontroller');

const userRouter = express.Router();
userRouter.post('/signup', authcontroller.signup);
userRouter.post('/login', authcontroller.login);
userRouter.get('/logout', authcontroller.LoggedOut);
userRouter.post('/forgotpassword', authcontroller.forgotPassword);
userRouter.patch('/resetpassword/:token', authcontroller.resetPassword);

userRouter.use(authcontroller.protect);

userRouter.route('/updatemypassword').patch(authcontroller.updatePassword);
// userRouter.route('/updateMe').patch(userController.updateMe);
userRouter.patch(
  '/updateMe',
  userController.upLoadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
userRouter.delete('/deleteMe', userController.deleteMe);
userRouter.route('/me').get(userController.getMe, userController.singleuser);

// userRouter.use(authcontroller.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getallusers)
  .post(userController.createuser);

userRouter
  .route('/:id')
  .get(userController.singleuser)
  .patch(userController.updateuser)
  .delete(userController.deleteuser);

module.exports = userRouter;
