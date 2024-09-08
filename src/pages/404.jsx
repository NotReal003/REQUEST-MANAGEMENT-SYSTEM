// src/pages/404.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegFaceGrinBeamSweat } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="form-container min-h-screen text-center items-center">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <img src="assets/hover.gif" alt="." className="w-1/2 size-2" />
        <p className="mb-4">The page you are looking for does not exist</p>
        <Link to="/" className="btn btn-outline btn-primary w-full flex items-center justify-center">Home</Link>
        </div>
    </div>
  );
};

export default NotFound;
