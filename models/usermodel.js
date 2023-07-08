const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email id'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid email id'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'lead-guide', 'guide'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordExpiresIn: Date,
  password: {
    type: String,
    required: [true, 'Please generate a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChanged: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  else {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  }
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChanged = Date.now() - 1000;
  next();
});
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  console.log(candidatePassword);
  return bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTtokencreated) {
  if (this.passwordChanged) {
    const changedtimestamp = parseInt(this.passwordChanged.getTime()) / 1000;

    console.log(changedtimestamp, JWTtokencreated);
    return changedtimestamp > JWTtokencreated;
  } else return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordExpiresIn = Date.now() + 60 * 10 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};
const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;
// exports.userModel = userModel;
