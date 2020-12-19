const Book = require('../models/bookModel').Book;
const Review = require('../models/reviewModel').Review;

exports.renderReviews = async (req, res, next) => {
  Review.find({}, (err, foundReviews) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (foundReviews) {
      res.render('reviews', {
        reviews: foundReviews,
        isAuthenticated: res.locals.userAuth,
        user: res.locals.user,
      });
    } else {
      res.render('reviews', {
        reviews: {},
        isAuthenticated: res.locals.userAuth,
        user: res.locals.user,
      });
    }
  });
};

exports.renderReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.reviewID });

    res.status(200).render('review', {
      review: review,
      isAuthenticated: res.locals.userAuth,
      user: res.locals.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.createReview = async (req, res, next) => {
  if (res.locals.userAuth) {

    const review = new Review({
      rev: req.body.review,
      rating: req.body.rating,
      user: req.user.username,
      timestamp: Date.now(),
    });

    console.log(req.body);

    Book.findOne({ _id: req.body.book_id }, (err, foundBook) => {
      if (err) {
        // return res.status(500).json(err);
        console.log(err);
      } else {
        if (foundBook) {
          review.book = foundBook;
          foundBook.numberOfReviews++;
          foundBook.reviewPoints += review.rating;
          foundBook.averageRating =
          foundBook.reviewPoints / foundBook.numberOfReviews;
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
  if (res.locals.userAuth) {
    res.status(200).json({
      message: 'Okay',
      review: req.params.reviewID,
    })
  } else {
    res.status(401).send('Not authenticated!');
  }
};
