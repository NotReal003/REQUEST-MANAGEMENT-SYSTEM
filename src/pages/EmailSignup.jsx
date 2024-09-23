import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from "react-icons/fa";

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await axios.post('https://api.notreal003.xyz/auth/email-signup', { email, username });
      toast.success('Verification email sent! Redirecting...');
      setTimeout(() => {
        navigate('/verify-email', { state: { email } });
      }, 3000);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was a problem during signup. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg">
      <ToastContainer />
      <div className="bg-gradient-to-br from-black-400 via-black-500 to-black-600 p-8 bg-opacity-10 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Sign Up with Email</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <button
            disabled={loading}
            type="submit" className="btn btn-primary w-full no-animation">
            {loading ? <span> <FaSpinner className="animate-spin inline-block align-middle mr-2" /> Sign Up </span> : <> Submit </>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailSignup;
