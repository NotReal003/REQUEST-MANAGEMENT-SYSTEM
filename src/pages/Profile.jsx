// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [requestsCount, setRequestsCount] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('https://api.notreal003.xyz/users/@me', {
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to load profile data.');
          throw new Error('Failed to fetch profile data.');
        }

        const userData = await response.json();
        setUser(userData);
        setDisplayName(userData.displayName);
        setRequestsCount(userData.requests.length); // Assuming requests are part of the user data
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleSaveDisplayName = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://api.notreal003.xyz/users/display', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ displayName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update display name.');
        throw new Error('Failed to update display name.');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setError(null);
    } catch (error) {
      console.error('Error updating display name:', error);
      setError('Failed to update display name.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-50">
        <div className="text-center">
          <span className="loading loading-spinner text-info"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-50">
        <div className="text-center">
          <strong className="text-lg text-red-500">{error}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={handleDisplayNameChange}
          className="input input-bordered w-full"
        />
        <button
          onClick={handleSaveDisplayName}
          className="btn btn-primary mt-2"
        >
          Save Display Name
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm">Email: <strong>{user.email}</strong></p>
        <p className="text-sm">Username: <strong>{user.username}</strong></p>
        <p className="text-sm">Requests Submitted: <strong>{requestsCount}</strong></p>
      </div>
      <Link to="/one" className="btn btn-secondary">View Your Requests</Link>
    </div>
  );
};

export default Profile;
