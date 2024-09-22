import React from 'react';
import { FaDiscord, FaEnvelope } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 max-w-md md:max-w-lg mx-auto shadow-lg rounded-lg">
      <div className="bg-gradient-to-br from-black-400 via-black-500 to-black-600 p-8 bg-opacity-10 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Login</h1>
        <p className="text-center text-white mb-8">Choose a login method to continue.</p>

        <button
          onClick={() => window.location.href = `https://api.notreal003.xyz/auth/signin`}
          className="btn btn-outline btn-primary w-full mt-5 flex items-center justify-center transition-all duration-200 no-animation hover:bg-primary hover:border-primary hover:text-white"
        >
          <FaDiscord className="mr-2" />
          Login with Discord
        </button>

        <Link to="/email-signin" className="btn btn-outline btn-secondary w-full mt-5 flex items-center justify-center transition-all duration-200 no-animation hover:bg-secondary hover:border-secondary hover:text-white">
          <FaEnvelope className="mr-2" />
          Login with Email
        </Link>

        <p className="text-center text-white mt-5">
          Don’t have an account?{" "}
          <Link to="/email-signup" className="text-primary hover:underline">
            Sign up with Email
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
