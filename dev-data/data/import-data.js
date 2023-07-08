const mongoose = require('mongoose');
const Tour = require('./../../models/tourmodel');
const Review = require('./../../models/reviewmodel');
const User = require('./../../models/usermodel');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: './../../config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
const main = async function () {
  const run = async function () {
    try {
      const res = await mongoose.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });

      if (res) console.log('The connection is possible');
    } catch (err) {
      console.log('The error occured 🎇', err);
    }
  };
  await run();
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
  const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
  const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
  );
  const importdata = async function () {
    try {
      await Tour.create(tours);
      await User.create(users, { validateBeforeSave: false });
      await Review.create(reviews);
      console.log('Data loaded successfully');
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
  const deleteall = async function () {
    try {
      await Tour.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();
      console.log('Data deleted successfully');
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
  // console.log(process.argv);
  if (process.argv[2] == '--import') {
    await importdata();
  } else if (process.argv[2] == '--delete') {
    await deleteall();
  }
};
main();
