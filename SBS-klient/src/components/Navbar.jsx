import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth0();
  
  // Check if user is admin - in a real app, this would be verified with backend
  // or using Auth0 roles/permissions
  const isAdmin = user && user.email;

  return (
    <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold">SB-system</div>
      <div className="flex space-x-4">
        <Link to="/Hem" className="hover:underline">Hem</Link>
        <Link to="/Böcker" className="hover:underline">Böcker</Link>
        <Link to="/mypages" className="hover:underline">Mina sidor</Link>
        {isAdmin && (
          <Link to="/Admin" className="hover:underline">Admin</Link>
        )}
      </div>
      {isAuthenticated && (
        <button
          className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200 transition"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logga ut
        </button>
      )}
    </nav>
  );
}