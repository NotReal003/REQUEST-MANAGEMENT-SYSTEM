import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaDiscord, FaLock } from "react-icons/fa";

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State to handle API errors

  useEffect(() => {
    // Extract 'code' from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
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
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <div className="flex items-center space-x-4">
        {/* Using React Icons for Discord and website logo */}
        <FaLock className="h-16 w-16 text-white" />
        <span className="text-4xl">+</span>
        <FaDiscord className="h-16 w-16 text-white" />
      </div>
      <p className="mt-8 m-4">Please wait while we are connecting your Discord account.</p>
      <div className="mt-4">
        <span className="loading loading-spinner text-info"></span>
      </div>

      {/* Displaying error message if there is one */}
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Callback;
