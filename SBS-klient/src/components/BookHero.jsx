import React from 'react';

export default function BookHero() {
  return (
    <div className="bg-gradient-to-r from-tabyBlue-500 to-tabyBlue-700 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-4">
          Vårt Bibliotek
        </h1>
        <p className="text-tabyBlue-100 text-xl max-w-2xl">
          Utforska vår samling av böcker. Här hittar du allt från klassisk litteratur till moderna favoriter.
        </p>
      </div>
    </div>
  );
}