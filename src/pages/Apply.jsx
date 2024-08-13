// src/pages/Apply.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { House } from 'lucide-react';
import { BiMessageRoundedX } from "react-icons/bi";

const Apply = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Guild Application <BiMessageRoundedX className="size-4 mr-2 ml-2" /></h1>
      <p>Comming soon!</p>
      <Link to="/" className="btn btn-outline btn-info mt-4 w-full">
        <House className='size-4'/> Back to Home
      </Link>
    </div>
  );
};

export default Apply;
