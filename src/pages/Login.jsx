import React from 'react';
import { Link } from 'react-router-dom';
import { FaDiscord } from "react-icons/fa6";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Login</h1>
        <p className="text-center text-gray-600 mb-8">You need to log in with Discord to continue.</p>
        <Link 
          to="https://api.notreal003.xyz/auth/signin" 
          className="btn btn-outline btn-info w-full mt-5 flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:bg-primary hover:text-white"
        >
          <FaDiscord className="mr-2" /> 
          Login with Discord
        </Link>
      </div>
    </div>
  );
};

export default Login;
