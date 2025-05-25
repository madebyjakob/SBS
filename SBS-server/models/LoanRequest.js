const mongoose = require('mongoose');

const loanRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedDate: Date,
  rejectedDate: Date
});

module.exports = mongoose.model('LoanRequest', loanRequestSchema);