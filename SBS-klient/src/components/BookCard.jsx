import React from 'react';

export default function BookCard({ book }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={book.coverImage} 
        alt={book.title} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-1">{book.title}</h3>
        <p className="text-gray-600 mb-2">By {book.author}</p>
        <button className="text-blue-600 font-medium hover:underline">
          Se detaljer
        </button>
      </div>
    </div>
  );
}