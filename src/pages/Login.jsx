import React from 'react';
import { Link } from 'react-router-dom';
import { FaDiscord } from "react-icons/fa6";
const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-4 mt-25">Login</h1>
      <p className="mb-8">You need to log in with Discord to access this site.</p>
      <Link to="https://api.notreal003.xyz/auth/signin" className="btn btn-outline btn-primary btn-sm"><FaDiscord /> Login with Discord</Link>

    </div>
  );
};

export default Login;
