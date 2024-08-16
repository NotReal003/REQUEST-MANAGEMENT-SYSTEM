// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaDiscord } from 'react-icons/fa';
import { MdSupportAgent } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { IoShieldCheckmark } from "react-icons/io5";
import axios from 'axios';

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    axios.get('https://api.notreal003.xyz/users/@me', {
      headers: { Authorization: `${token}` }
    })
      .then(response => {
        if (response.data.id === '1131271104590270606') { // Check admin ID
          setIsAdmin(true);
        }
      })
      .catch(error => {
        console.error('Failed to check admin status:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4 h-5">
      <h1 className="text-2xl font-bold mb-6">Requests</h1>
      <div className="space-y-6 mt-4">
        <Link to="/one" className="btn btn-outline btn-info w-full"><IoShieldCheckmark />Your Requests</Link>
        <Link to="/report" className="btn btn-outline btn-warning w-full"><FaDiscord />Discord Report</Link>
        <Link to="/apply" className="btn btn-outline btn-secondary w-full"><IoMdMail />Guild Application</Link>
        <Link to="/support" className="btn btn-outline btn-accent w-full"><MdSupportAgent />Support Request</Link>
        {isAdmin && (
          <Link to="/admin" className="btn btn-outline btn-primary w-full">Admin Dashboard</Link>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
