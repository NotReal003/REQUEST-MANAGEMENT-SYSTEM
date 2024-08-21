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
    <div className="min-h-screen flex flex-col justify-center p-4">
      <div className="bg rounded-lg shadow-lg p-8 w-full max-w-md md:max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Requests</h1>

        <div className="space-y-6">
          <Link to="/one" className="btn btn-outline btn-info w-full">
            <span className="flex"><IoShieldCheckmark className="mr-2" />Your Requests</span>
          </Link>

          <h2 className="text-xl font-bold">New Request</h2>

          <Link to="/report" className="btn btn-outline btn-warning w-full">
            <span className="flex"><FaDiscord className="mr-2" />Discord Report</span>
          </Link>

          <Link to="/apply" className="btn btn-outline btn-secondary w-full">
            <span className="flex"><IoMdMail className="mr-2" />Guild Application</span>
          </Link>

          <Link to="/support" className="btn btn-outline btn-accent w-full">
            <span className="flex"><MdSupportAgent className="mr-2" />Support Request</span>
          </Link>

          {isAdmin && (
            <Link to="/admin" className="btn btn-outline btn-error w-full flex justify-between items-center">
              <span className="flex items-center">Admin Dashboard</span>
            </Link>
          )}

          {isAdmin && (
            <Link to="/profile" className="btn btn-outline btn-info w-full flex justify-between items-center">
              <span className="flex items-center">Profile</span>
            </Link>
          )}
        </div>
      </div>
      <Footer className="mt-8" />
    </div>
  );
};

export default Home;
