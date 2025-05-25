require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const booksRouter = require('./routes/books');
const loanRequestsRouter = require('./routes/loanRequests');
const adminRouter = require('./routes/admin');

// Use routes
app.use('/api/books', booksRouter);
app.use('/api/loan-requests', loanRequestsRouter);
app.use('/api/admin', adminRouter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});