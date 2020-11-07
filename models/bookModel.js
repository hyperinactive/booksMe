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
  isbn: {
    type: Number,
    required: true,
  },
  description: String,
  publisher: {
    type: String,
    required: true,
  },
  yearOfPublication: {
    type: Number,
    required: true,
  },
  img: String,
});

const Book = new mongoose.model('Book', bookSchema);

module.exports = {
  Book: Book,
  bookSchema: bookSchema,
};
