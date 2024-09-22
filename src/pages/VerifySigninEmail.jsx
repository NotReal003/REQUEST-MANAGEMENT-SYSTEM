import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifySigninEmail = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`https://api.notreal003.xyz/auth/verify-signin-email?email=${email}`);
        toast.success('Your sign-in has been verified!');
        setTimeout(() => navigate('/'), 5000);
      } catch (error) {
        toast.error('There was an error verifying your sign-in. Please try again.');
        setStatus('Verification Failed.');
      }
    };

    if (email) verify();
  }, [email, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg">
      <ToastContainer />
      <div className="bg-gradient-to-br from-black-400 via-black-500 to-black-600 p-8 bg-opacity-10 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">{status}</h1>
      </div>
    </div>
  );
};

export default VerifySigninEmail;
