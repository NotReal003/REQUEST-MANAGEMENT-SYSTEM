import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailSignin = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: Code input

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await axios.post('https://api.notreal003.xyz/auth/email-signin', { email });
      toast.success('Verification code sent to your email.');
      setStep(2); // Move to the code verification step
    } catch (error) {
      toast.error('There was a problem during signin. Please try again.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.notreal003.xyz/auth/verify-signin-email-code', { email, code });
      const jwtToken = response.data.jwtToken;
      localStorage.setItem('jwtToken', jwtToken);
      toast.success('Sign-in successful!');
      setTimeout(() => {
        window.location.href = '/'; // Redirect to the home page after successful sign-in
      }, 3000);
    } catch (error) {
      toast.error('Invalid or expired verification code.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg">
      <ToastContainer />
      <div className="bg-gradient-to-br from-black-400 via-black-500 to-black-600 p-8 bg-opacity-10 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full">
        {step === 1 ? (
          <>
            <h1 className="text-4xl font-bold mb-6 text-center text-white">Sign In with Email</h1>
            <form onSubmit={handleSignin}>
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
              <button type="submit" className="btn btn-primary w-full">
                Send Verification Code
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-6 text-center text-white">Enter Verification Code</h1>
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="6-Digit Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Verify Code
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailSignin;
