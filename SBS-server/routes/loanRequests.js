const express = require('express');
const router = express.Router();
const LoanRequest = require('../models/LoanRequest');
const Book = require('../models/Book');

// Get all loan requests
router.get('/', async (req, res) => {
  try {
    const loanRequests = await LoanRequest.find();
    res.json(loanRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new loan request
router.post('/', async (req, res) => {
  const { userId, userName, isbn, bookTitle } = req.body;
  
  // Validate required fields
  if (!userId || !userName || !isbn || !bookTitle) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    // Check if book exists
    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if book is available
    if (!book.instock || book.loaner) {
      return res.status(409).json({ message: 'Book is not available for loan' });
    }
    
    // Check if user already has a pending request for this book
    const existingRequest = await LoanRequest.findOne({
      userId,
      isbn,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(409).json({ message: 'You already have a pending request for this book' });
    }
    
    const newRequest = new LoanRequest({
      userId,
      userName,
      isbn,
      bookTitle
    });
    
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve a loan request
router.put('/:id/approve', async (req, res) => {
  try {
    const request = await LoanRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Loan request not found' });
    }
    
    // Check if request is already processed
    if (request.status !== 'pending') {
      return res.status(409).json({ message: 'This request has already been processed' });
    }
    
    // Check if book is still available
    const book = await Book.findOne({ isbn: request.isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!book.instock || book.loaner) {
      return res.status(409).json({ message: 'Book is no longer available for loan' });
    }
    
    // Update book status
    book.instock = false;
    book.loaner = request.userName;
    await book.save();
    
    // Update request status
    request.status = 'approved';
    request.approvedDate = new Date();
    const updatedRequest = await request.save();
    
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject a loan request
router.put('/:id/reject', async (req, res) => {
  try {
    const request = await LoanRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Loan request not found' });
    }
    
    // Check if request is already processed
    if (request.status !== 'pending') {
      return res.status(409).json({ message: 'This request has already been processed' });
    }
    
    // Update request status
    request.status = 'rejected';
    request.rejectedDate = new Date();
    const updatedRequest = await request.save();
    
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;