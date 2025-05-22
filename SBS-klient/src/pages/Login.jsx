import React, { useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Hem');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center">Välkommen till SB-system</h1>
      <p className="mt-4 text-lg text-center">
        Vänligen logga in nedan.
      </p>
      {!isAuthenticated && (
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => loginWithRedirect()}
        >
          Logga in
        </button>
      )}
    </div>
  );
}