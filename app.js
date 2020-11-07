require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

const User = require('./models/userModel').User;

const UserController = require('./controllers/userController');
const ReviewController = require('./controllers/reviewController');
const BookController = require('./controllers/bookController');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  res.render('home');
});

// handle users
app
  .route('/register')
  .get(UserController.renderRegister)
  .post(UserController.register);
app
  .route('/login')
  .get(UserController.renderLogin)
  .post(UserController.login);
app.get('/logout', UserController.logout);

// handle reviews
app
  .route('/reviews')
  .get(ReviewController.getReviews)
  .post(ReviewController.createReview)
  .delete(ReviewController.deleteReview);

// handle books
app
  .route('/books')
  .get(BookController.getBooks)
  .post(BookController.createBook);

// handle non-existent URLs or internal errors
app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    error: 'No such page exists',
  });
});

app.use((req, res, next) => {
  res.status(500).send({
    status: 500,
    error: 'Internal server error, sorry, sorry :(',
  });
});

module.exports = app;
