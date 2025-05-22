const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with a real database in production)
let books = [];
let loanRequests = [];

// API Routes

// Get all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Get a specific book by ISBN
app.get('/api/books/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// Add a new book
app.post('/api/books', (req, res) => {
  const { isbn, title, author, instock, loaner, coverImage } = req.body;
  
  // Validate required fields
  if (!isbn || !title || !author) {
    return res.status(400).json({ message: 'ISBN, title, and author are required' });
  }
  
  // Check if book with ISBN already exists
  if (books.some(b => b.isbn === isbn)) {
    return res.status(409).json({ message: 'A book with this ISBN already exists' });
  }
  
  const newBook = {
    id: uuidv4(),
    isbn,
    title,
    author,
    instock: instock !== undefined ? instock : true,
    loaner: loaner || '',
    coverImage: coverImage || '',
    addedDate: new Date().toISOString()
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

// Bulk add books from spreadsheet
app.post('/api/books/bulk', (req, res) => {
  const { books: newBooks } = req.body;
  
  if (!Array.isArray(newBooks) || newBooks.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty books array' });
  }
  
  let addedCount = 0;
  let errors = [];
  
  newBooks.forEach(book => {
    // Validate required fields
    if (!book.ISBN || !book.title || !book.author) {
      errors.push(`Book with title "${book.title || 'Unknown'}" is missing required fields`);
      return;
    }
    
    // Check if book already exists
    if (books.some(b => b.isbn === book.ISBN)) {
      errors.push(`Book with ISBN ${book.ISBN} already exists`);
      return;
    }
    
    const newBook = {
      id: uuidv4(),
      isbn: book.ISBN,
      title: book.title,
      author: book.author,
      instock: book.instock !== undefined ? Boolean(book.instock) : true,
      loaner: book.loaner || '',
      coverImage: book.coverImage || '',
      addedDate: new Date().toISOString()
    };
    
    books.push(newBook);
    addedCount++;
  });
  
  res.json({
    added: addedCount,
    errors: errors.length > 0 ? errors : undefined
  });
});

// Update a book
app.put('/api/books/:isbn', (req, res) => {
  const { title, author, instock, loaner, coverImage } = req.body;
  const bookIndex = books.findIndex(b => b.isbn === req.params.isbn);
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  books[bookIndex] = {
    ...books[bookIndex],
    title: title || books[bookIndex].title,
    author: author || books[bookIndex].author,
    instock: instock !== undefined ? instock : books[bookIndex].instock,
    loaner: loaner !== undefined ? loaner : books[bookIndex].loaner,
    coverImage: coverImage || books[bookIndex].coverImage,
    updatedDate: new Date().toISOString()
  };
  
  res.json(books[bookIndex]);
});

// Delete a book
app.delete('/api/books/:isbn', (req, res) => {
  const bookIndex = books.findIndex(b => b.isbn === req.params.isbn);
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  res.json(deletedBook);
});

// Get all loan requests
app.get('/api/loan-requests', (req, res) => {
  res.json(loanRequests);
});

// Create a new loan request
app.post('/api/loan-requests', (req, res) => {
  const { userId, userName, isbn, bookTitle } = req.body;
  
  // Validate required fields
  if (!userId || !userName || !isbn || !bookTitle) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Check if book exists
  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  // Check if book is available
  if (!book.instock || book.loaner) {
    return res.status(409).json({ message: 'Book is not available for loan' });
  }
  
  // Check if user already has a pending request for this book
  if (loanRequests.some(req => 
    req.userId === userId && 
    req.isbn === isbn && 
    req.status === 'pending'
  )) {
    return res.status(409).json({ message: 'You already have a pending request for this book' });
  }
  
  const newRequest = {
    id: uuidv4(),
    userId,
    userName,
    isbn,
    bookTitle,
    requestDate: new Date().toISOString(),
    status: 'pending'
  };
  
  loanRequests.push(newRequest);
  res.status(201).json(newRequest);
});

// Approve a loan request
app.put('/api/loan-requests/:id/approve', (req, res) => {
  const requestIndex = loanRequests.findIndex(r => r.id === req.params.id);
  
  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Loan request not found' });
  }
  
  const request = loanRequests[requestIndex];
  
  // Check if request is already processed
  if (request.status !== 'pending') {
    return res.status(409).json({ message: 'This request has already been processed' });
  }
  
  // Check if book is still available
  const bookIndex = books.findIndex(b => b.isbn === request.isbn);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  if (!books[bookIndex].instock || books[bookIndex].loaner) {
    return res.status(409).json({ message: 'Book is no longer available for loan' });
  }
  
  // Update book status
  books[bookIndex].instock = false;
  books[bookIndex].loaner = request.userName;
  
  // Update request status
  loanRequests[requestIndex].status = 'approved';
  loanRequests[requestIndex].approvedDate = new Date().toISOString();
  
  res.json(loanRequests[requestIndex]);
});

// Reject a loan request
app.put('/api/loan-requests/:id/reject', (req, res) => {
  const requestIndex = loanRequests.findIndex(r => r.id === req.params.id);
  
  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Loan request not found' });
  }
  
  const request = loanRequests[requestIndex];
  
  // Check if request is already processed
  if (request.status !== 'pending') {
    return res.status(409).json({ message: 'This request has already been processed' });
  }
  
  // Update request status
  loanRequests[requestIndex].status = 'rejected';
  loanRequests[requestIndex].rejectedDate = new Date().toISOString();
  
  res.json(loanRequests[requestIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});