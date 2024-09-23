import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
  const { code } = useParams();
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
         const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
        if (!code) {
          toast.error('Invalid verification code');
          return;
        }
        await axios.get(`https://api.notreal003.xyz/auth/verify-email?token=${token}`);
        toast.success('Your email has been verified!');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        toast.error('There was an error verifying your email. Please try again.');
        setStatus('Verification Failed.');
      }
    };

    if (code) verify();
  }, [requestId, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg">
      <ToastContainer />
      <div className="bg-gradient-to-br from-black-400 via-black-500 to-black-600 p-8 bg-opacity-10 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">{status}</h1>
        <p>Please wait a moment...</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
