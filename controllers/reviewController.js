const Book = require('../models/bookModel').Book;
const Review = require('../models/reviewModel').Review;

exports.getReviews = async (req, res, next) => {
  let authFlag = false;
  let username = 'Guest';
  if (req.isAuthenticated()) {
    authFlag = true;
    username = req.user.username;
  }
  Book.find({}, (err, foundBooks) => {
    if (err) {
      console.log(err);
    } else {
      Review.find({}, (err, foundReviews) => {
        if (err) {
          console.log(err);
        } else {
          res.render('reviews', {
            reviews: foundReviews,
            books: foundBooks,
            isLogReg: false,
            isAuthenticated: authFlag,
          });
        }
      });
    }
  });
};

exports.createReview = async (req, res, next) => {
  let authFlag = false;
  let username = 'Guest';
  if (req.isAuthenticated()) {
    authFlag = true;
    username = req.user.username;

    const review = new Review({
      rev: req.body.review,
      grade: req.body.rating,
      user: req.user.username,
    });

    const tit = req.body.re.toString();

    Book.findOne({ title: tit }, (err, foundBook) => {
      if (err) {
        console.log(err);
      } else {
        if (foundBook) {
          review.book = foundBook;
          review.save();
        } else {
          console.log('No such book exists');
        }
      }
    });
  } else {
    console.log('Only registered users can enter data');
  }
};

exports.deleteReview = async (req, res, next) => {
  if (isAuthenticated) {
    username = req.user.username;
  } else {
    res.send('Not authenticated!');
  }
};
