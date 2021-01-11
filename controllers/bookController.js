const Author = require('../models/authorModel').Author;
const Book = require('../models/bookModel').Book;
const GridFSStream = require("gridfs-stream");
const mongoose = require('mongoose');

exports.renderBooks = async (req, res, next) => {
  res.render('books', {
    isAuthenticated: res.locals.userAuth,
    user: res.locals.user,
  });
};

exports.getCover = async (req, res, next) => {
  // set up the gridfs
  let  gfs = GridFSStream(mongoose.connection.db, mongoose.mongo);
  let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
  gfs.collection("uploads");

  gfs.files.findOne(
    { _id: mongoose.Types.ObjectId(req.params.imageID) },
    (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({ err: "No file found" });
      }

      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/jpg" ||
        file.contentType === "image/png"
      ) {

        const readStream = gridFSBucket.openDownloadStream(file._id);
        readStream.pipe(res);
      } else {
        res.status(404).json({ err: "Not an image" });
      }
    },
  );
};

exports.createBook = async (req, res, next) => {
  if (res.locals.userAuth) {
    let coverPath;
    // req.file === undefined ? coverPath = 'public/images/default_cover.jpg' : coverPath = req.file.path;
    // default image, ~ not to be deleted ~

    // --------------------------
    // logo
    // req.file === undefined ? coverPath = '5ff7a7e6df52ac00043bea1c' : coverPath = req.file.id;
    // --------------------------

    // legacy default
    // req.file === undefined ? coverPath = '5ff86e6f9237580004a1fda0' : coverPath = req.file.id;

    // default
    // 5ffcc6410e09330004bc4a2f
    req.file === undefined ? coverPath = '5ffcc6410e09330004bc4a2f' : coverPath = req.file.id;

    // req.file === undefined ? coverPath = '5ff7a7e6df52ac00043bea1c' : coverPath = req.file.id;
    // coverPath = req.file.id;

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
  const foundBook = await Book.findById(req.params.bookID);

  res.status(200).render('book', {
    book: foundBook,
    isAuthenticated: res.locals.userAuth,
    user: res.locals.user,
  });
};
