const User = require('../models/userModel').User;
const Book = require('../models/bookModel').Book;
const Review = require('../models/reviewModel').Review;
const mongoose = require('mongoose');

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
  Review.findOne({ _id: req.params.reviewID }, (err, fReview) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    let ownership;
    // quick and dirty
    if (res.locals.user === null) {
      console.log('user is null');
      ownership = false;
    } else {
      console.log(fReview.user._id);
      console.log(res.locals.user._id);

      String(fReview.user._id) === String(res.locals.user._id)
        ? (ownership = true)
        : (ownership = false);
    }

    console.log(ownership);

    res.status(200).render('review', {
      review: fReview,
      ownership: ownership,
      isAuthenticated: res.locals.userAuth,
      user: res.locals.user,
    });
  });
};

exports.createReview = async (req, res, next) => {
  if (res.locals.userAuth) {
    User.findOne({ _id: res.locals.user._id }, (err, fUser) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      if (fUser) {
        console.log(fUser);
        const review = new Review({
          rev: req.body.review,
          rating: req.body.rating,
          user: fUser,
          timestamp: Date.now(),
        });

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
      }
    });
  } else {
    console.log('Only registered users can enter data');
  }
  res.status(302).redirect(`books/${req.body.book_id}`);
};

// todo - upon deletion, update the book stats
exports.deleteReview = async (req, res, next) => {
  if (res.locals.userAuth) {
    try {
      Review.findOneAndDelete({ id: req.params.id }, (err, fReview) => {
        if (fReview) {
          Book.findOne({ id: req.params.id }, (err, fBook) => {
            if (fBook) {
              fBook.reviewPoints -= fReview.rating;
              fBook.numberOfReviews--;
              fBook.averageRating = fBook.reviewPoints / fBook.numberOfReviews;
              fBook.save();

              res.status(200).json({ fReview: fReview, fBook: fBook });
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

exports.updateReview = async (req, res, next) => {
  if (res.locals.userAuth) {
    try {
      // console.log(req.body);

      const originalReview = await Review.findById(req.params.reviewID);
      Book.findOne({ _id: originalReview.book._id }, (err, fBook) => {
        if (err) {
          console.log(err);
        } else {
          if (fBook) {
            Review.findOne({ _id: req.params.reviewID }, (err, fReview) => {
              if (err) {
                console.log(err);
              } else {
                if (fReview) {
                  fReview.rev = req.body.review;
                  fReview.rating = Number(req.body.rating);
                  fReview.save();
                }
              }
            });
            fBook.reviewPoints -= Number(originalReview.rating);
            fBook.reviewPoints += Number(req.body.rating);
            fBook.averageRating = fBook.reviewPoints / fBook.numberOfReviews;
            fBook.save();
          }
        }
      });

      res.status(200).json({ message: 'worked' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};
