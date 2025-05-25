const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  instock: {
    type: Boolean,
    default: true
  },
  loaner: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date
  }
});

module.exports = mongoose.model('Book', bookSchema);