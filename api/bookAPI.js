const bookModel = require('../models/bookModel');

const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;

exports.getBooks = async (req, res, next) => {

  Book.find({}, (err, foundBooks) => {
    if (err) {
      return res.json({
        error: err,
      });
    } else {
      res.status(200).json(foundBooks);
    }
  });
};