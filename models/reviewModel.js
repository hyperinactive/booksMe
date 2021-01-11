const mongoose = require('mongoose');
const bookModel = require('./bookModel').Book;
const bookSchema = require('./bookModel').bookSchema;
const userModel = require('./userModel').User;
const userSchema = require('./userModel').userSchema;

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
    type: userSchema,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  }
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = {
  reviewSchema: reviewSchema,
  Review: Review,
};
