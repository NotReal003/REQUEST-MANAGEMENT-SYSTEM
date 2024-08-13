import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        navigate('/404');
        return;
      }

      try {
        const userResponse = await axios.get('https://api.notreal003.xyz/users/@me', {
          headers: { Authorization: `${jwtToken}` },
        });
        const user = userResponse.data;

        if (user.id === '1131271104590270606' || user.isAdmin) {
          user.isAdmin = true;
        }

        if (!user.isAdmin) {
          navigate('/404');
        } else {
          const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
            headers: { Authorization: `${jwtToken}` },
          });
          setRequests(requestsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleCardClick = (requestId) => {
    navigate(`/admindetail?id=${requestId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request._id}
            className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => handleCardClick(request._id)}
          >
            <h2 className="text-xl font-semibold mb-2">Request by {request.username}</h2>
            <p className="mb-2"><strong>Status:</strong> {request.status}</p>
            <p className="mb-2"><strong>Message Link:</strong> {request.messageLink}</p>
            <p className="mb-2"><strong>Additional Info:</strong> {request.additionalInfo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
