import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BookHero from '../components/BookHero';
import BookFilter from '../components/BookFilter';
import BookGrid from '../components/BookGrid';

// Mock data - replace with actual API calls in production
const mockBooks = [
  {
    id: 1,
    title: "The Latest Adventure",
    author: "Jane Doe",
    coverImage: "https://placehold.co/400x600?text=Latest+Book",
    isLatest: true,
    isPopular: true,
    publishDate: "2023-10-15"
  },
  {
    id: 2,
    title: "Mystery of the Mountains",
    author: "John Smith",
    coverImage: "https://placehold.co/400x600?text=Popular+Book",
    isLatest: false,
    isPopular: true,
    publishDate: "2023-09-20"
  },
  {
    id: 3,
    title: "Coding Mastery",
    author: "Alex Johnson",
    coverImage: "https://placehold.co/400x600?text=New+Book",
    isLatest: true,
    isPopular: false,
    publishDate: "2023-10-10"
  },
  {
    id: 4,
    title: "History Unveiled",
    author: "Sarah Williams",
    coverImage: "https://placehold.co/400x600?text=Book+4",
    isLatest: false,
    isPopular: true,
    publishDate: "2023-08-05"
  }
];

export default function Books() {
  const [filter, setFilter] = useState('all'); // 'all', 'latest', or 'popular'
  
  // Get the latest book for the hero section
  const latestBook = mockBooks.reduce((latest, book) => 
    new Date(book.publishDate) > new Date(latest.publishDate) ? book : latest, 
    mockBooks[0]
  );
  
  // Filter books based on selection
  const filteredBooks = mockBooks.filter(book => {
    if (filter === 'all') return true;
    if (filter === 'latest') return book.isLatest;
    if (filter === 'popular') return book.isPopular;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <BookHero book={latestBook} />
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        <BookFilter filter={filter} setFilter={setFilter} />
        <BookGrid books={filteredBooks} />
      </div>
    </div>
  );
}