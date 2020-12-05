const bookModel = require('../models/bookModel');
const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;

exports.getBooks = async (req, res, next) => {

  // you're not making this easy, mongoose... just give me the count of stuff
  const numberOfElements = await Book.find({}).count(function (err, count) {
    if (err) {
      console.log(err);
    }
  });

  const fbooks = await Book.find({}, (err, foundBooks) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
  }).skip(req.body.skip).limit(req.body.limit);

  // if the last of the items' shipped, send a flag to stop sending requests
  return numberOfElements <= req.body.limit + req.body.skip ?
    res.status(200).json({
    empty: true,
    data: fbooks
    })
    : res.status(200).json({
    empty: false,
    data: fbooks
    });
  
};