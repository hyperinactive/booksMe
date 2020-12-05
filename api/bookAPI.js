const bookModel = require('../models/bookModel');
const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;

exports.getBooks = async (req, res, next) => {

  // console.log(req.body.limit, req.body.skip);

  const fbooks = await Book.find({}, (err, foundBooks) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
  }).skip(req.body.skip).limit(req.body.limit);

  res.status(200).json(fbooks)

};