import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdSettings, IoMdListBox } from "react-icons/io";
import { FaDiscord, FaCheck, FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import EditProfileModal from '../components/EditProfileModal';
import { MdMarkEmailRead } from "react-icons/md";

const Profile = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        // Fetch user info
        const userResponse = await axios.get('https://api.notreal003.xyz/users/@me', {
          headers: { Authorization: `${token}` }
        });

        // Fetch request count
        const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
          headers: { Authorization: `${token}` }
        });

        setUser(userResponse.data);
        setRequestCount(requestsResponse.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);
  const handleUpdateDisplayName = (newDisplayName) => {
    setUser((prevUser) => ({
      ...prevUser,
      displayName: newDisplayName,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner text-info"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="text-center">
          <strong className="text-lg text-red-500">{error}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        {user && user.avatarHash ? (
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}.webp?size=128`}
            className="w-24 h-24 rounded-full shadow-lg"
          />
        ) : (
          <FaUserCircle className="w-24 h-24 rounded-full shadow-lg" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{user.displayName || user.username}</h1>
          <p>@{user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Account Details</h2>
          <div className="text-sm">
            <p>
              <strong>
                <MdMarkEmailRead className="inline-block align-middle mr-1" /> Email:
              </strong> 
              {user.email}
            </p>
            <p>
              <strong>
                <FaCheck className="inline-block align-middle mr-1" /> Joined:
              </strong> 
              {new Date(user.joinedAt).toLocaleDateString()}
            </p>
            <p>
              <strong>
                <FaDiscord className="inline-block align-middle mr-1" /> Discord ID:
              </strong> 
              {user.id}
            </p>
          </div>

        </div>

        <div className="p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Request Summary</h2>
          <div className="flex items-center">
            <IoMdListBox className="w-6 h-6 text-blue-500 mr-2" />
            <p className="text-lg">{requestCount} requests submitted</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button className="btn btn-outline btn-info btn-sm flex items-center" onClick={() => navigate(`discord:/users/${user.id}`)}>
          <FaDiscord className="mr-2" /> View Discord Profile
        </button>
        <button className="btn btn-outline btn-secondary btn-sm" onClick={() => setEditModalOpen(true)}><IoMdSettings /> Edit Profile
        </button>
      </div>
      <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          currentDisplayName={user?.displayName || user?.username}
          onUpdate={handleUpdateDisplayName}
        />
    </div>
  );
};

export default Profile;
