// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaDiscord } from 'react-icons/fa';
import { MdOutlineSupportAgent, MdOutlineSecurity } from "react-icons/md";
import { SiFormstack } from "react-icons/si";

const Home = () => {
  return (
    <div className="container mx-auto p-4 h-5">
      <h1 className="text-2xl font-bold mb-6">Requests</h1>
      <div className="space-y-6 mt-4">
          <Link to="/one" className="btn btn-outline btn-warning w-full"><SiFormstack />Your Requests</Link>
        <Link to="/report" className="btn btn-outline btn-info w-full"><FaDiscord />Discord Report</Link>
        <Link to="/apply" className="btn btn-outline btn-secondary w-full"><MdOutlineSecurity /> Guild Application</Link>
        <Link to="/support" className="btn btn-outline btn-accent w-full"><MdOutlineSupportAgent />Support Request</Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
