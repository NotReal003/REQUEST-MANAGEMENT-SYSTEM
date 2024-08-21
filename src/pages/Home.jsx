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
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: 'url(/your-background-image.jpg)' }}>
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md md:max-w-lg mx-4">
        <h1 className="text-2xl font-bold text-center mb-6">Your Requests</h1>

        <div className="space-y-6">
          <Link to="/one" className="btn btn-primary w-full flex justify-between items-center">
            <span className="flex items-center"><IoShieldCheckmark className="mr-2" />Your Requests</span>
            <i className="fas fa-arrow-right"></i>
          </Link>

          <h2 className="text-xl font-bold text-center">New Request</h2>

          <Link to="/report" className="btn btn-warning w-full flex justify-between items-center">
            <span className="flex items-center"><FaDiscord className="mr-2" />Discord Report</span>
            <i className="fas fa-arrow-right"></i>
          </Link>

          <Link to="/apply" className="btn btn-secondary w-full flex justify-between items-center">
            <span className="flex items-center"><IoMdMail className="mr-2" />Guild Application</span>
            <i className="fas fa-arrow-right"></i>
          </Link>

          <Link to="/support" className="btn btn-accent w-full flex justify-between items-center">
            <span className="flex items-center"><MdSupportAgent className="mr-2" />Support Request</span>
            <i className="fas fa-arrow-right"></i>
          </Link>

          {isAdmin && (
            <Link to="/admin" className="btn btn-error w-full flex justify-between items-center">
              <span className="flex items-center">Admin Dashboard</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          )}

          {isAdmin && (
            <Link to="/profile" className="btn btn-info w-full flex justify-between items-center">
              <span className="flex items-center">Profile</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </div>
      <Footer className="mt-8" />
    </div>
  );
};

export default Home;
