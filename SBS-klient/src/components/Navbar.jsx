import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth0();
  const { isAdmin, isLoading } = useAdmin();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-tabyBlue-500">
            SB-system
          </Link>
          <div className="flex space-x-6">
            <Link to="/books" className="text-tabyBlue-600 hover:text-tabyBlue-800 transition-colors">
              Böcker
            </Link>
            <Link to="/mypages" className="text-tabyBlue-600 hover:text-tabyBlue-800 transition-colors">
              Mina sidor
            </Link>
            {!isLoading && isAdmin && (
              <Link to="/admin" className="text-tabyBlue-600 hover:text-tabyBlue-800 transition-colors">
                Admin
              </Link>
            )}
          </div>
          {isAuthenticated && (
            <button
              className="px-4 py-2 bg-white text-tabyBlue-600 rounded hover:bg-gray-200 transition"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logga ut
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}