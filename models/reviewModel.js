const mongoose = require('mongoose');
const bookModel = require('./bookModel');
const bookSchema = bookModel.bookSchema;

const reviewSchema = new mongoose.Schema({
  book: {
    type: bookSchema,
    required: true,
  },
  rev: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  user: {
    type: String,
    required: true,
  },
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = {
  reviewSchema: reviewSchema,
  Review: Review,
};
