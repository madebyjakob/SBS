const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific book by ISBN
router.get('/:isbn', async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new book
router.post('/', async (req, res) => {
  const { isbn, title, author, instock, loaner, coverImage } = req.body;
  
  // Validate required fields
  if (!isbn || !title || !author) {
    return res.status(400).json({ message: 'ISBN, title, and author are required' });
  }
  
  try {
    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(409).json({ message: 'A book with this ISBN already exists' });
    }
    
    const newBook = new Book({
      isbn,
      title,
      author,
      instock: instock !== undefined ? instock : true,
      loaner: loaner || '',
      coverImage: coverImage || ''
    });
    
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk add books from spreadsheet
router.post('/bulk', async (req, res) => {
  const { books: newBooks } = req.body;
  
  if (!Array.isArray(newBooks) || newBooks.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty books array' });
  }
  
  let addedCount = 0;
  let errors = [];
  
  try {
    for (const book of newBooks) {
      // Validate required fields
      if (!book.ISBN || !book.title || !book.author) {
        errors.push(`Book with title "${book.title || 'Unknown'}" is missing required fields`);
        continue;
      }
      
      // Check if book already exists
      const existingBook = await Book.findOne({ isbn: book.ISBN });
      if (existingBook) {
        errors.push(`Book with ISBN ${book.ISBN} already exists`);
        continue;
      }
      
      const newBook = new Book({
        isbn: book.ISBN,
        title: book.title,
        author: book.author,
        instock: book.instock !== undefined ? Boolean(book.instock) : true,
        loaner: book.loaner || '',
        coverImage: book.coverImage || ''
      });
      
      await newBook.save();
      addedCount++;
    }
    
    res.json({
      added: addedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a book
router.put('/:isbn', async (req, res) => {
  const { title, author, instock, loaner, coverImage } = req.body;
  
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (title) book.title = title;
    if (author) book.author = author;
    if (instock !== undefined) book.instock = instock;
    if (loaner !== undefined) book.loaner = loaner;
    if (coverImage) book.coverImage = coverImage;
    book.updatedDate = new Date();
    
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a book
router.delete('/:isbn', async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await Book.deleteOne({ isbn: req.params.isbn });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;