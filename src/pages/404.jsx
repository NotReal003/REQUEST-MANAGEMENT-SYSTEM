// src/pages/404.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="form-container text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="mb-4">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Home</Link>
        <Link to="https://notreal003.xyz" className="btn mt=5 p=10">NotReal003</Link>
        <Link to="https://suppport.notreal003.xyz" className="btn">Support HelpDesk</Link>
      </div>
    </div>
  );
};

export default NotFound;
