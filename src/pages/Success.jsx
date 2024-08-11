import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, House } from 'lucide-react';
import { FaDiscord } from "react-icons/fa6";
const Success = () => {
  return (
    <div className="flex items-center justify-center bg-base-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CircleCheck className="w-20 h-20 text-green-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Success!</h1>
        <p className="text-lg">Your request was submitted successfully, join our Discord Server so we may contact you :)</p>
        <Link to="/" className="btn btn-outline btn-info mt-4 w-full">
          <House className='size-4'/> Back to Home
        </Link>
        <a target="_blank" href="https://discord.gg/sqVBrMVQmp" className="btn btn-outline btn-primary w-full mt-5"><FaDiscord /> Join our Discord Server</a>
      </div>
    </div>
  );
}

export default Success;