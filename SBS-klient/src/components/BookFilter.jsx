import React from 'react';

export default function BookFilter({ filter, setFilter }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold">Bläddra bland böckerna</h2>
      <div className="flex space-x-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Alla
        </button>
        <button 
          onClick={() => setFilter('latest')}
          className={`px-4 py-2 rounded ${filter === 'latest' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Senaste
        </button>
        <button 
          onClick={() => setFilter('popular')}
          className={`px-4 py-2 rounded ${filter === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Mest populära
        </button>
      </div>
    </div>
  );
}