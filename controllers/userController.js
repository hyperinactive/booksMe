const passport = require('passport');
const User = require('../models/userModel').User;

exports.renderRegister = async (req, res, next) => {
  let user = 'Guest';
  let alreadyLoggedFlag = false;
  if (req.isAuthenticated()) {
    alreadyLoggedFlag = true;
    user = req.user;
  }
  let logRegFlag = true;
  res.render('register', {
    isLogReg: logRegFlag,
    isAuthenticated: alreadyLoggedFlag,
    user: user,
  });
};

exports.renderLogin = async (req, res, next) => {
  let alreadyLoggedFlag = false;
  let user = "Guest";
  if (req.isAuthenticated()) {
    alreadyLoggedFlag = true;
    user = req.user;
  }
  let logRegFlag = true;
  res.render('login', {
    isLogReg: logRegFlag,
    isAuthenticated: alreadyLoggedFlag,
    callType: 'login',
    user: user,
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

exports.renderUser = async (req, res, next) => {
  res.status(200).json(req.params.userID);
}

exports.logout = async (req, res, next) => {
  req.logout();
  res.redirect('/');
};
