import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaDiscord, FaLock } from "react-icons/fa";

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State to handle API errors
  const [loadind, setLoading] = useState(null);
  useEffect(() => {
    // Extract 'code' from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setLoading(true);
      // Send a GET request to your API with the Discord code
      axios.get(`https://api.notreal003.xyz/auth/callback?code=${code}`)
        .then(response => {
          if (response.status === 200) {
            const token = response.data.jwtToken;
            localStorage.setItem('jwtToken', token);
            window.location.href = `https://api.notreal003.xyz/auth/ip?token=${token}`;
          }
        })
        .catch(error => {
          console.error('Error during authentication:', error);
          // Set error message from the API response
          setError(error.response.data.message || 'An error occurred while signing in.');
        });
    } else {
      setError('No authorization code found in URL. Please SignIn again.');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <FaLock className="h-16 w-16" />
        <span className="text-3xl">+</span>
        <FaDiscord className="h-16 w-16" />
      </div>
      {!error && (
      <div className="flex items-center justify-center mt-8 m-4 shadow-lg">
      <p className="font-serif">Pleaee wait while we are securely connecting your Discord account.</p>
        <span className="loading loading-spinner text-warning mt-2 items-center justify-center"></span>
      </div>
      )}
      {error && (
        <div className="mt-8 m-4 font-serif text-red-500 justify-center shadow-lg pb-2">
          <strong>{error}</strong>
        </div>
      )}
    </div>
  );
};

export default Callback;
