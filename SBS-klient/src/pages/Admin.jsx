import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { isAuthenticated, user } = useAuth0();
  const [activeTab, setActiveTab] = useState('upload');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin - in a real app, this would be verified with backend
  useEffect(() => {
    if (user && user.email) {
      // This is a placeholder - in a real app, you'd check with your backend
      // or use Auth0 roles/permissions
      setIsAdmin(true);
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
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
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium ${activeTab === 'upload' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'}`}
            >
              Ladda upp böcker
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`px-6 py-3 font-medium ${activeTab === 'add' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'}`}
            >
              Lägg till bok
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 font-medium ${activeTab === 'requests' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'}`}
            >
              Låneförfrågningar
            </button>
          </div>
          
          <div className="p-6">
            <React.Suspense fallback={<div>Laddar...</div>}>
              {activeTab === 'upload' && <BookUpload />}
              {activeTab === 'add' && <BookForm />}
              {activeTab === 'requests' && <LoanRequestsTable />}
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}