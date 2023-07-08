// const mongoose = require('mongoose');

// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });
// const app = require('./app');
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
// mongoose
//   .connect('mongodb+srv://newuser:Mkir5Q4BlSi61d88@cluster0.jysaopw.mongodb.net/?retryWrites=true&w=majority' ,{

//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then((con) => {
//     console.log(con.connections);
//     console.log('The connection is succesful');
//   });
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
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
// });
// var Tour = mongoose.model('Tour', tourschema);

// const testtour = new Tour({
//   name: 'The forest Hiker',
//   price: 500,
//   rating: 7.8,
// });

// testtour.save(function (err, k) {
//   if (err) return console.log('Error 🎇:', err);
// });
// .then((doc) => console.log(doc))
// .catch((err) => {
//   console.log('Error 🎇:', err);
// });

// const run = async function () {
//   try {
//     const res = await mongoose.connect(DB, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//     });

//     if (res) console.log('The connection is possible');

//     // const testtour = new Tour({
//     //   name: 'The park camphor',
//     // });

//     // const res1 = await testtour.save();
//     // if (!res1) throw new Error('The document cannot be saved');

//     // console.log(res1);
//   } catch (err) {
//     console.log('The error occured 🎇', err);
//   }
// };
// run();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tourrev = require('./models/tourmodel');
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception error');
  console.log(err.name, err.message);
});
const app = require('./app');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
const run = async function () {
  const x = await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  if (!x) throw new Error('No connection is possible');
  console.log('The connecion is successful');
  // console.log(x.connections);
};
run();
console.log(process.env.NODE_ENV);
const server = app.listen(3000, () => {
  console.log('Sun raha hu mein');
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejected promise ');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
