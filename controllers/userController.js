const passport = require('passport');
const User = require('../models/userModel').User;
const Review = require('../models/reviewModel').Review;

exports.renderRegister = async (req, res, next) => {
  res.status(200).render('register', {
    isAuthenticated: res.locals.userAuth,
    user: res.locals.user,
  });
};

exports.renderLogin = async (req, res, next) => {
  res.status(200).render('login', {
    isAuthenticated: res.locals.userAuth,
    user: res.locals.user,
  });
};

exports.register = async (req, res, next) => {
  User.findOne(
    { username: { $regex: new RegExp('^' + req.body.username + '$', 'i') } },
    (err, foundUser) => {
      if (err) {
        console.log(err);
        return res.status(406).json(err);
      } else {
        if (foundUser) {
          res.send('User with that username already exists');
        } else {
          User.register(
            { username: req.body.username },
            req.body.password,
            (err, user) => {
              if (err) {
                console.log(err);
                res.status(301).redirect('/register');
              } else {
                passport.authenticate('local')(req, res, () => {
                  res.status(301).redirect('/books');
                });
              }
            },
          );
        }
      }
    },
  );
};

exports.login = (req, res, next) => {
  if (res.locals.userAuth) {
    return res.status(400).json({
      message: 'Already logged!',
    });
  }
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {

      passport.authenticate('local')(req, res, () => {
        res.status(301).redirect('/books');        
      });

    }
  });
};

exports.userReviews = async (req, res, next) => {
  const fReviews = await Review.find({ 'user._id': res.locals.user._id });

  res.status(200).render('userReviews', {
    isAuthenticated: res.locals.userAuth,
    user: res.locals.user,
    reviews: fReviews,
  });
};

exports.logout = async (req, res, next) => {
  req.logout();
  res.status(301).redirect('/books');
};
