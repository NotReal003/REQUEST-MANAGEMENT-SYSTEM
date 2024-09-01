import React from 'react';
import { Link } from 'react-router-dom';
import { FaDiscord } from "react-icons/fa6";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-8 bg-opacity-75 rounded-lg shadow-lg max-w-sm ml-2 mr-2 m-2 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Login</h1>
        <p className="text-center text-white mb-8">You need to log in with Discord to continue.</p>
        <Link 
          to="https://api.notreal003.xyz/auth/signin" 
          className="btn btn-outline btn-primary w-full mt-5 flex items-center justify-center transition-all duration-200 hover:bg-primary hover:text-white"
        >
          <FaDiscord className="mr-2" /> 
          Login with Discord
        </Link>
      </div>
    </div>
  );
};

export default Login;
