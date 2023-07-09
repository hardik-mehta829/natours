// const port = 3000;
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Learning express', app: 'natours' });
// });
// app.post('/', (req, res) => {
//   res.status(200).send('It is a post');
// });
// app.listen(port, () => {
//   console.log(`Hello from the server at ${port}...`);
// });
const fs = require('fs');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const HPP = require('hpp');
const xss = require('xss-clean');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const apperror = require('./utils/apperror');
const globalerrorcontroller = require('./controllers/errorcontroller');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const exp = require('constants');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests.Please try again after one hour',
});
 //app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ['*'],
        'script-src': [
         'https://js.stripe.com/v3/',
          'https://natours-first.onrender.com/',
          'https://natours-first.onrender.com/js/alert.js',
           'https://natours-first.onrender.com/js/axios.js',
          'https://natours-first.onrender.com/js/login.js',
          'https://natours-first.onrender.com/js/mapbox.js',
           'https://natours-first.onrender.com/js/stripe.js',
          'https://natours-first.onrender.com/js/updateSettings.js'
        ],
        // 'style-src': ['self', 'https://fonts.googleapis.com', 'unsafe-inline'],
      },
    },
  })
);
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  HPP({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
app.use(express.static(path.join(__dirname, 'public')));
// app.use((req, res, next) => {
//   console.log('Hello from the middlewar 👋');
//   next();
// });
app.use((req, res, next) => {
  req.requesttime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// app.get('/api/v1/tours', getalltours);
// app.get('/api/v1/tours/:id/:x?', singletour);
// app.post('/api/v1/tours', createtour);
// app.patch('/api/v1/tours/:id', updatetour);
// app.delete('/api/v1/tours/:id', deletetour);
//Routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  console.log('It reached');
  // const err = new Error(
  //   `Can't find a route handler for the request ${req.originalUrl}`
  // );
  // err.status = 'Fail to execute';
  // err.statuscode = 404;

  next(
    new apperror(
      `Can't find a route handler for the request ${req.originalUrl}`,
      404
    )
  );
});
app.use(globalerrorcontroller);
module.exports = app;
