import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterUserId, setFilterUserId] = useState('');
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
          user.isAdmin = true; // Ensure isAdmin is true if the user ID matches
        }

        if (!user.isAdmin) {
          navigate('/404'); // Redirect non-admin users to the 404 page
        } else {
          const requestsResponse = await axios.get('https://api.notreal003.xyz/admin/requests', {
            headers: { Authorization: `${jwtToken}` },
          });

          const sortedRequests = requestsResponse.data.sort((a, b) => {
            if (a.status === 'PENDING' && b.status !== 'PENDING') {
              return -1;
            }
            if (a.status !== 'PENDING' && b.status === 'PENDING') {
              return 1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          setRequests(sortedRequests);
          setFilteredRequests(sortedRequests);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleFilterChange = (e) => {
    const userId = e.target.value;
    setFilterUserId(userId);

    if (userId) {
      const filtered = requests.filter(request => request.username.includes(userId));
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by User ID"
          value={filterUserId}
          onChange={handleFilterChange}
          className="input input-bordered w-full"
        />
      </div>

      {filteredRequests.map((request) => (
        <div
          key={request._id}
          className="p-4 shadow-lg rounded mb-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white cursor-pointer"
          onClick={() => navigate(`/admindetail?id=${request._id}`)}
        >
          <h2 className="text-xl font-semibold mb-2">Request by {request.username}</h2>
          <p className="mb-2"><strong>Status:</strong> {request.status}</p>
          <p className="mb-2"><strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default Admin;
