// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Requests/h1>
      <div className="space-y-4">
        <Link to="/report" className="btn btn-primary w-full">Discord Report</Link>
        <Link to="/apply" className="btn btn-secondary w-full">Guild Application</Link>
        <Link to="/support" className="btn btn-accent w-full">Support Request</Link>
      </div>
    </div>
  );
};

export default Home;
