const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
});

const Author = new mongoose.model('Author', authorSchema);

module.exports = {
  Author: Author,
  authorSchema: authorSchema,
};
