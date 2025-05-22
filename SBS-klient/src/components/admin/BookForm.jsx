import React, { useState } from 'react';

export default function BookForm() {
  const [book, setBook] = useState({
    isbn: '',
    title: '',
    author: '',
    instock: true,
    loaner: '',
    coverImage: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!book.isbn || !book.title || !book.author) {
      setMessage({
        text: 'ISBN, titel och författare är obligatoriska fält',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ett fel uppstod');
      }

      setMessage({
        text: 'Boken har lagts till framgångsrikt!',
        type: 'success'
      });
      
      // Reset form
      setBook({
        isbn: '',
        title: '',
        author: '',
        instock: true,
        loaner: '',
        coverImage: ''
      });
    } catch (error) {
      setMessage({
        text: error.message || 'Ett fel uppstod vid tillägg av boken',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lägg till ny bok</h2>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="isbn" className="block mb-1 font-medium">ISBN*</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">Titel*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="author" className="block mb-1 font-medium">Författare*</label>
          <input
            type="text"
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="coverImage" className="block mb-1 font-medium">Omslagsbild URL</label>
          <input
            type="url"
            id="coverImage"
            name="coverImage"
            value={book.coverImage}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div>
          <label htmlFor="loaner" className="block mb-1 font-medium">Utlånare</label>
          <input
            type="text"
            id="loaner"
            name="loaner"
            value={book.loaner}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Lämna tomt om ingen har lånat boken"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="instock"
            name="instock"
            checked={book.instock}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="instock" className="ml-2 block text-sm font-medium">
            Finns i lager
          </label>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded font-medium ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Lägger till...' : 'Lägg till bok'}
          </button>
        </div>
      </form>
    </div>
  );
}