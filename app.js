require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// SETUP
// ------------------------------------------------------

// config the templating engine, static folder, bodyParser and morgan
// I HATE YOU EXPRESS, I'll learn Koa I swear
// ok, so the default middleware is pointing to the public folder as the default path to static stuff
// but if called from another location which is not root
// it won't grant access, and a new middleware is needed with the provided path for the route calling
app.use(express.static('public'));
app.use('/user', express.static('public'));
app.use('/user/:userID', express.static('public'));
app.use('/books/:bookID', express.static('public'));
app.use('/reviews/:reviewID', express.static('public'));


app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(morgan('dev'));

// config corse
app.use(cors());

// config express sessions
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// config passport
app.use(passport.initialize());
app.use(passport.session());

// connect to the database
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// deprecated error fix
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
  console.log('connected to mongodb oh hell yea');
});
mongoose.connection.on('error', () => {
  console.log('error connecting to mongodb, oh hell yea');
});

// get authentication middleware
const authenticationMiddleware = require('./middleware/authenticate');

// get modules
const User = require('./models/userModel').User;
const BookAPI = require('./api/bookAPI');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// config passport
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTE HANDLING
// ------------------------------------------------------

// landing page
app.get('/', authenticationMiddleware, (req, res) => {
  res.render('home', { isAuthenticated: res.locals.userAuth, user: res.locals.user});
});

// handle user routes
app.use('/user', authenticationMiddleware, userRoutes);


// handle reviews
app.use('/reviews', authenticationMiddleware, reviewRoutes);

// handle books
app.use('/books', authenticationMiddleware, bookRoutes);

app.post('/bookAPI', BookAPI.getBooks);


// HOPE CODE NEVER REACHES THIS PART
// ------------------------------------------------------

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
