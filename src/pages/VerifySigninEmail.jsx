import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifySigninEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('token');
    const signIn = async () => {
      try {
        const response = await axios.post(`https://api.notreal003.xyz/auth/verify-signin-email`, {
          token: code,
        });
        toast.success('Your sign-in has been verified!');
        const jwtToken = response.data.jwtToken;
        localStorage.setItem('jwtToken', jwtToken);
        setTimeout(() => navigate('/'), 5000);
      } catch (error) {
        console.log(error);
        toast.error('There was an error verifying your sign-in. Please try again.');
        setStatus('Verification Failed.');
      }
    };
    signIn();
  }, [code, token, navigate]);

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
