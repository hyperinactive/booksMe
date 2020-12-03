const mongoose = require('mongoose');
const authorModel = require('./authorModel');
const authorSchema = authorModel.authorSchema;

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: authorSchema,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: String,
  yearOfPublication: {
    type: Number,
    required: true,
  },
  coverImage: String,
  numberOfReads: Number,
  numberOfReviews: Number
});

const Book = new mongoose.model('Book', bookSchema);

module.exports = {
  Book: Book,
  bookSchema: bookSchema,
};
