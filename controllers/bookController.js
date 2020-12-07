const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;

exports.getBooks = async (req, res, next) => {
  let authFlag = false;
  let username = 'Guest';

  if (req.isAuthenticated()) {
    authFlag = true;
    username = req.user.username;
  }

  let authorsMid = {};
  Author.find({}, (err, foundAuthors) => {
    if (err) {
      console.log(err);
    } else {
      authorsMid = foundAuthors;
      Book.find({}, (err, foundBooks) => {
        if (err) {
          console.log(err);
        } else {
          res.render('books', {
            isAuthenticated: authFlag,
            isLogReg: false,
            books: foundBooks,
            userName: username,
            authors: authorsMid,
          });
        }
      });
    }
  });
};

exports.createBook = async (req, res, next) => {
  if (req.isAuthenticated()) {
    let coverPath;
    !req.file.path ? (coverPath = null) : (coverPath = req.file.path);

    let book = new Book({
      title: req.body.title,
      description: req.body.description,
      yearOfPublication: req.body.yearOfPublication,
      genre: req.body.genre,
      coverImage: coverPath,
      numberOfReviews: 0,
      averageRating: 0,
      reviewPoints: 0,
    });

    const info = req.body.author;

    Author.findOne(
      { name: { $regex: new RegExp('^' + info + '$', 'i') } },
      (err, foundAuthor) => {
        if (err) {
          console.log(err);
        } else {
          // if an author has been found, his id will be books author id
          if (foundAuthor) {
            book.author = foundAuthor;
            Book.findOne(
              {
                title: book.title,
                author: book.author,
              },
              (err, foundBook) => {
                if (err) {
                  console.log(err);
                } else {
                  if (foundBook) {
                    res.status(418).send('Book already exists');
                  } else {
                    book.save();
                  }
                }
                res.status(308).redirect('/books');
              }
            );
          } else {
            // no author found, create one and store him
            const newAuthor = new Author({
              name: info,
            });
            book.author = newAuthor;
            newAuthor.save();
            book.save();
            res.status(201).redirect('/books');
          }
        }
      }
    );
  } else {
    res.status(401).json({
      error: 'Invalid user',
    });
  }
};

exports.getBook = async (req, res, next) => {
  let authFlag = false;
  let username = 'Guest';

  if (req.isAuthenticated()) {
    authFlag = true;
    username = req.user.username;
  }

  const foundBook = await Book.findById(req.params.bookID);

  res.status(200).render('book', {
    book: foundBook,
    isAuthenticated: authFlag,
    isLogReg: false,
  });

  // res.status(200).json(foundBook);

};
