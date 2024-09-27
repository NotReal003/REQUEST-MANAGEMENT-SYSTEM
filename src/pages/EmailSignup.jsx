import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaSpinner } from "react-icons/fa";

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Signup, Step 2: Verify code
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    if (!agreedToTerms) {
      toast.error('You must agree to the terms and privacy policy to sign up.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('https://api.notreal003.xyz/auth/email-signup', { email, username });
      toast.success('Verification code sent! Please check your email.');
      setStep(2); // Move to verification step
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was a problem during signup. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      toast.error('Please enter the verification code sent to your email');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://api.notreal003.xyz/auth/verify-email', { email, code: verificationCode });
      const jwtToken = response.data.jwtToken;
      localStorage.setItem('jwtToken', jwtToken);
      toast.success('Email verified successfully! You are now signed up.');
      setLoading(false);
      window.location.href = `https://api.notreal003.xyz/auth/user?callback=${jwtToken}`;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired verification code. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg">
      <Toaster />
      <div className="bg-gradient-to-br from-black-400 via-black-500 to-black-600 p-8 bg-opacity-10 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full">
        <h1 className="text-xl font-bold mb-6 text-center text-white">{step === 1 ? 'Sign Up with Email' : 'Verify Your Email'}</h1>

        {step === 1 && (
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

            <div className="form-control mb-4">
              <label className="cursor-pointer label">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className="label-text ml-2 text-white">
                  I agree to the NotReal003's{' '}
                  <a href="https://support.notreal003.xyz/terms" className="hover:underline">Terms of Service</a> and{' '}
                  <a href="https://support.notreal003.xyz/privacy" className="hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              disabled={loading}
              type="submit" className="btn btn-primary w-full no-animation">
              {loading ? <span> <FaSpinner className="animate-spin inline-block align-middle mr-2" /> Signing Up... </span> : <> Submit </>}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter verification code"
                className="input input-bordered w-full"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              type="submit" className="btn btn-primary w-full no-animation">
              {loading ? <span> <FaSpinner className="animate-spin inline-block align-middle mr-2" /> Verifying... </span> : <> Verify </>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailSignup;
