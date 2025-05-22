import React from 'react';
import BookLoanRequest from './BookLoanRequest';

export default function BookDetail({ book, onClose, onLoanRequestComplete }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{book.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={book.coverImage || "https://placehold.co/400x600?text=No+Cover"} 
                alt={book.title} 
                className="w-full h-auto rounded-lg shadow"
              />
            </div>
            
            <div className="md:w-2/3">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Författare</h3>
                <p>{book.author}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold">ISBN</h3>
                <p>{book.isbn}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Status</h3>
                <p>
                  {book.instock && !book.loaner ? (
                    <span className="text-green-600">Tillgänglig</span>
                  ) : (
                    <span className="text-red-600">Inte tillgänglig</span>
                  )}
                </p>
              </div>
              
              {book.loaner && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Utlånad till</h3>
                  <p>{book.loaner}</p>
                </div>
              )}
              
              <BookLoanRequest 
                book={book} 
                onRequestComplete={onLoanRequestComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}