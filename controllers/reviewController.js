const Book = require('../models/bookModel').Book;
const Review = require('../models/reviewModel').Review;

exports.renderReviews = async (req, res, next) => {
  let authFlag = false;
  let username = 'Guest';
  if (req.isAuthenticated()) {
    authFlag = true;
    username = req.user.username;
  }
  Review.find({}, (err, foundReviews) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (foundReviews) {
      res.render('reviews', {
        reviews: foundReviews,
        isLogReg: false,
        isAuthenticated: authFlag,
      });
    } else {
      res.render('reviews', {
        reviews: {},
        isLogReg: false,
        isAuthenticated: authFlag,
      });
    }
  });
  
};

exports.renderReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({_id: req.params.reviewID}) 

    res.status(200).json(review);

  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.createReview = async (req, res, next) => {
  let authFlag = false;
  let username = 'Guest';
  if (req.isAuthenticated()) {
    authFlag = true;
    username = req.user.username;

    const review = new Review({
      rev: req.body.review,
      rating: req.body.rating,
      user: req.user.username,
      timestamp: Date.now(),
    });

    console.log(req.body);

    Book.findOne({_id: req.body.book_id}, (err, foundBook) => {
      if (err) {
        // return res.status(500).json(err);
        console.log(err);
      } else {
        if (foundBook) {
          review.book = foundBook;
          foundBook.numberOfReviews++;
          foundBook.reviewPoints += review.rating;
          foundBook.averageRating = foundBook.reviewPoints / foundBook.numberOfReviews;
          foundBook.save();
          review.save();
        } else {
          return res.status(404).send('No book found');
        }
      }
    });
  } else {
    console.log('Only registered users can enter data');
  }
  res.status(302).redirect('reviews');
};

// todo - upon deletion, update the book stats
exports.deleteReview = async (req, res, next) => {
  if (isAuthenticated) {
    username = req.user.username;
  } else {
    res.status(401).send('Not authenticated!');
  }
};
