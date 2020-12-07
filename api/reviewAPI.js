const Review = require('../models/reviewModel').Review;
const Book = require('../models/bookModel').Book;


exports.getReviewsSingleBook = async (req, res, next) => {

  // to search nested stuff, "field.nested_field" : some_search_parameter
  const numberOfElements = await Review.find({"book._id": req.params.bookID}).countDocuments(function (err, count) {
    if (err) {
      res.status(500).json(err)
    }
  });

  const freviews = await Review.find({"book._id": req.params.bookID}, (err, foundBooks) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
  // }).skip(req.body.skip).limit(req.body.limit);
  }).skip(req.body.skip).limit(req.body.limit);

  // if the last of the items' shipped, send a flag to stop sending requests
  return numberOfElements <= req.body.limit + req.body.skip ?
    res.status(200).json({
    empty: true,
    data: freviews,
    })
    : res.status(200).json({
    empty: false,
    data: freviews,
    });
};