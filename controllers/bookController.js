const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;

exports.getBooks = (req, res, next) => {
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
    }
  });
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
};

// Placeholder pic: https://previews.123rf.com/images/mousemd/mousemd1710/mousemd171000009/87405336-404-not-found-concept-glitch-style-vector.jpg
exports.createBook = (req, res, next) => {
  if (req.isAuthenticated()) {
    let book = new Book({
      title: req.body.title,
      isbn: req.body.isbn,
      description: req.body.description,
      publisher: req.body.publisher,
      yearOfPublication: req.body.yearOfPublication,
    });

    const info = req.body.author;

    Author.findOne(
      { name: { $regex: new RegExp('^' + info + '$', 'i') } },
      (err, foundAuthor) => {
        if (err) {
          console.log(err);
        } else {
          if (foundAuthor) {
            book.author = foundAuthor;

            Book.findOne(
              {
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                publisher: book.publisher,
              },
              (err, foundBook) => {
                if (err) {
                  console.log(err);
                } else {
                  if (foundBook) {
                    res.send('Book already exists');
                  } else {
                    book.save();
                    //todo
                    setTimeout(() => {
                      res.redirect('/books');
                    }, 500);
                  }
                }
              }
            );
          } else {
            const newAuthor = new Author({
              name: info,
            });
            book.author = newAuthor;
            newAuthor.save();
            book.save();
            res.redirect('/books');
          }
        }
      }
    );
  } else {
    throw new Error('Invalid user');
  }
};