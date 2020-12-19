module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.userAuth = true;
    res.locals.user = req.user;
  } else {
	res.locals.userAuth = false;
	res.locals.user = null;
  }
  next();
};
