import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function BookLoanRequest({ book, onRequestComplete }) {
  const { user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLoanRequest = async () => {
    if (!user) {
      setMessage({ text: 'Du måste vara inloggad för att låna böcker', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/loan-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.sub,
          userName: user.name || user.email,
          isbn: book.isbn,
          bookTitle: book.title
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ett fel uppstod');
      }

      setMessage({
        text: 'Din låneförfrågan har skickats och väntar på godkännande',
        type: 'success'
      });
      
      if (onRequestComplete) {
        onRequestComplete();
      }
    } catch (error) {
      setMessage({
        text: error.message || 'Ett fel uppstod vid låneförfrågan',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <button
        onClick={handleLoanRequest}
        disabled={isLoading || !book.instock || book.loaner}
        className={`px-4 py-2 rounded font-medium ${
          isLoading || !book.instock || book.loaner
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Skickar förfrågan...' : 'Låna bok'}
      </button>
      
      {!book.instock && (
        <p className="mt-2 text-red-600">Denna bok är inte tillgänglig för utlåning</p>
      )}
      
      {book.loaner && (
        <p className="mt-2 text-gray-600">Utlånad till: {book.loaner}</p>
      )}
    </div>
  );
}