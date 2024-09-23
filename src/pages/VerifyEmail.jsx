import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from "react-icons/fa";

const VerifyEmail = () => {
  const { code } = useParams();
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
         const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
        if (!token) {
          toast.error('Invalid verification code');
          setLoading('No veirfication code found.')
          return;
        }
        setLoading('<span><FaSpinner className="animate-spin inline-block align-middle mr-2" /> Please wait a moment...</span>');
        const response = await axios.get(`https://api.notreal003.xyz/auth/email-verify?token=${token}`);
        toast.success('Your email has been verified!');
        setLoading('Verification Done.');
        const jwtToken = response.data.jwtToken;
          localStorage.setitem('jwtToken', jwtToken);
        navigate('/');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'There was an error verifying your email. Please try again.';
        setLoading(errorMessage);
        toast.error(errorMessage);
        setStatus('Verification Failed.');
      }
    };

    verifyAccount();
  }, [code, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg">
      <ToastContainer />
      <div className="bg-gradient-to-br from-black-400 via-black-500 to-black-600 p-8 bg-opacity-10 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">{status}</h1>
        {loading}
      </div>
    </div>
  );
};

export default VerifyEmail;
