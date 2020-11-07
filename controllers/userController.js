const passport = require('passport');
const User = require('../models/userModel').User;

exports.renderRegister = (req, res, next) => {
  callTypeString = 'register';
  let alreadyLoggedFlag = false;
  if (req.isAuthenticated()) {
    alreadyLoggedFlag = true;
    callTypeString = 'alreadyLogged';
  }
  let logRegFlag = true;
  res.render('register', {
    isLogReg: logRegFlag,
    isAuthenticated: alreadyLoggedFlag,
    callType: callTypeString,
  });
};

exports.renderLogin = (req, res, next) => {
  let alreadyLoggedFlag = false;
  if (req.isAuthenticated()) {
    alreadyLoggedFlag = true;
  }
  let logRegFlag = true;
  res.render('register', {
    isLogReg: logRegFlag,
    isAuthenticated: alreadyLoggedFlag,
    callType: 'login',
  });
};

exports.register = (req, res, next) => {
  User.findOne(
    { username: { $regex: new RegExp('^' + req.body.username + '$', 'i') } },
    (err, foundUser) => {
      if (err) {
        console.log(err);
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
                res.redirect('/register');
              } else {
                passport.authenticate('local')(req, res, () => {
                  res.redirect('/books');
                });
              }
            }
          );
        }
      }
    }
  );
};

exports.login = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/books');
      });
    }
  });
};

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};
