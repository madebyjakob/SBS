import React from 'react';

export default function BookCard({ title, author, available }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-tabyBlue-800 mb-2">{title}</h3>
            <p className="text-tabyBlue-600 mb-3">{author}</p>
            <div className={`text-sm font-medium ${available ? 'text-tabyBlue-500' : 'text-tabyBlue-300'}`}>
                {available ? 'Tillgänglig' : 'Utlånad'}
            </div>
        </div>
    );
}