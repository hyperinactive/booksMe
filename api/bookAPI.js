const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;

exports.getBooks = async (req, res, next) => {
  // you're not making this easy, mongoose... just give me the count of stuff

  console.log(req.body);
  const searchParam = new RegExp(req.body.search, 'i');
  console.log(searchParam);

  let query = {};

  if (searchParam !== '/(?:)/i') {
    query = {
      $or: [{ title: searchParam }, { 'author.name': searchParam  }],
    };
  }

  const numberOfElements = await Book.find(query).countDocuments(function (
    err,
    count
  ) {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
  });

  const fbooks = await Book.find(query, (err, foundBooks) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
  })
    .skip(req.body.loadedBooks)
    .limit(req.body.rate)
    .sort({_id: -1});

  // if the last of the items' shipped, send a flag to stop sending requests
  return numberOfElements <= req.body.rate + req.body.loadedBooks
    ? res.status(200).json({
        empty: true,
        data: fbooks,
      })
    : res.status(200).json({
        empty: false,
        data: fbooks,
      });
};
