import React from 'react';

export default function BookHero({ book }) {
  return (
    <div className="bg-blue-700 text-white">
      <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Upptäck de senaste böckerna</h1>
          <h2 className="text-2xl mb-2">{book.title}</h2>
          <p className="text-xl mb-6">Av {book.author}</p>
          <button className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Läs mer
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="w-64 h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}