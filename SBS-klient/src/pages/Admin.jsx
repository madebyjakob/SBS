import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

export default function Admin() {
  const { isAuthenticated } = useAuth0();
  const { isAdmin, isLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState('upload');

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Laddar...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Åtkomst nekad</h2>
            <p>Du har inte behörighet att se denna sida.</p>
          </div>
        </div>
      </div>
    );
  }

  // Dynamically import components to avoid errors if xlsx is not installed
  const BookUpload = React.lazy(() => import('../components/admin/BookUpload'));
  const BookForm = React.lazy(() => import('../components/admin/BookForm'));
  const LoanRequestsTable = React.lazy(() => import('../components/admin/LoanRequestsTable'));

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded ${activeTab === 'upload'
                    ? 'bg-tabyBlue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setActiveTab('upload')}
              >
                Ladda upp böcker
              </button>
              <button
                className={`px-4 py-2 rounded ${activeTab === 'add'
                    ? 'bg-tabyBlue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setActiveTab('add')}
              >
                Lägg till bok
              </button>
              <button
                className={`px-4 py-2 rounded ${activeTab === 'requests'
                    ? 'bg-tabyBlue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setActiveTab('requests')}
              >
                Låneförfrågningar
              </button>
            </div>
          </div>

          <React.Suspense fallback={<div>Laddar...</div>}>
            {activeTab === 'upload' && <BookUpload />}
            {activeTab === 'add' && <BookForm />}
            {activeTab === 'requests' && <LoanRequestsTable />}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}