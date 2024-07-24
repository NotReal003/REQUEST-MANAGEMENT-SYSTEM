import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, House } from 'lucide-react';
const Success = () => {
  return (
    <div className="flex items-center justify-center bg-base-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CircleCheck className="w-20 h-20 text-green-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Success!</h1>
        <p className="text-lg">Your request was submitted successfully.</p>
        <Link to="/" className="btn btn-outline btn-info mt-4 w-full">
          <House className='size-4'/> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Success;