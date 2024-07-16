// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Requests</h1>
      <div className="space-y-6 mt-4">
        <Link to="/report" className="btn btn-outline btn-info w-full">Discord Report</Link>
        <Link to="/apply" className="btn btn-outline btn-secondary w-full">Guild Application</Link>
        <Link to="/support" className="btn btn-outline btn-accent w-full">Support Request</Link>
      </div>
    </div>
    <Footer />
  );
};

export default Home;
