const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;

const renderBooks = (req, foundBooks, authorsMid) => {
  let authFlag = false;
  let username = 'Guest';

  if (req.isAuthenticated()) {
    authFlag = true;
    username = req.user.username;
  }

  return {
    isAuthenticated: authFlag,
    isLogReg: false,
    books: foundBooks,
    userName: username,
    authors: authorsMid,
  }
}

exports.getBooks = async (req, res, next) => {
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
          res.status(200).render('books', renderBooks(req, foundBooks, authorsMid));
        }
          
      });
    }
  });
  
};

exports.createBook = async (req, res, next) => {
  if (req.isAuthenticated()) {
    let coverPath;
    req.file.path ? coverPath = null : coverPath = req.file.path;

    let book = new Book({
      title: req.body.title,
      description: req.body.description,
      yearOfPublication: req.body.yearOfPublication,
      genre: req.body.genre,
      coverImage: coverPath,
      numberOfReads: 0,
      numberOfreviews: 0,
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
                    res.send('Book already exists');
                  } else {
                    book.save();
                  }
                }
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
            res.redirect('/books');
          }
        }
      }
    );
  } else {
    throw new Error('Invalid user');
  }
};
