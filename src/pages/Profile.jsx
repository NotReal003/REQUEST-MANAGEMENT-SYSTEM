// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        // Fetch user info
        const userResponse = await axios.get('https://api.notreal003.xyz/users/@me', {
          headers: { Authorization: `${token}` },
        });
        setUser(userResponse.data);

        // Fetch request count
        const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
          headers: { Authorization: `${token}` },
        });
        setRequestCount(requestsResponse.data.length);

        setLoading(false);
      } catch (error) {
        setError(error.response?.data.message || 'Failed to load profile.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-info"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <strong className="text-lg text-red-500">{error}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4">
        <img
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}.png`}
          alt="User Avatar"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.displayName || user.username}</h2>
          <p className="text-gray-600">Total Requests Submitted: {requestCount}</p>
        </div>
      </div>
      {/* Add more user-related info here */}
    </div>
  );
};

export default Profile;
