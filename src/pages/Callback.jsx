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
            // Save the returned token in localStorage
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
      setError('No authorization code found in URL.');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center space-x-4">
        {/* Using React Icons for Discord and website logo */}
        <FaLock className="h-16 w-16" />
        <span className="text-3xl">+</span>
        <FaDiscord className="h-16 w-16" />
      </div>
      {!error && (
      <div className="mt-8 m-4 items-center justify-center shadow-lg">
      <p className="font-serif">Please wait while we are connecting your Discord account.</p>
        <span className="loading loading-spinner text-warning mt-2"></span>
      </div>
      )}

      {/* Displaying error message if there is one */}
      {error && (
        <div className="mt-8 font-serif text-red-500 justify-center shadow-lg">
          <strong>{error}</strong>
        </div>
      )}
    </div>
  );
};

export default Callback;
