import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';

function Admin() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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
          const requestsResponse = await axios.get('https://api.notreal003.xyz/admin/requests', {
            headers: { Authorization: `${jwtToken}` },
          });
          const sortedRequests = requestsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRequests(sortedRequests);
//          setRequests(requestsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleRequestClick = (requestId) => {
    navigate(`/admindetail?id=${requestId}`);
  };

  const filteredRequests = requests
    .filter((request) => {
      return (
        (!searchQuery || request.id.includes(searchQuery)) &&
        (!filterStatus || request.status === filterStatus)
      );
    })
    .sort((a, b) => {
      if (filterStatus === 'PENDING') {
        return a.status === 'PENDING' ? -1 : 1;
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by User ID"
          className="input input-bordered w-full max-w-xs mr-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="DENIED">Denied</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredRequests.map((request) => (
        <div
          key={request._id}
          className={`p-4 shadow rounded-lg mb-4 cursor-pointer ${
            request.status === 'APPROVED'
              ? 'bg-green-700'
              : request.status === 'DENIED'
              ? 'bg-red-700'
              : request.status === 'CANCELED'
              ? 'bg-yellow-700'
              : 'bg-gray-700'
          }`}
          onClick={() => handleRequestClick(request._id)}
        >
          <h2 className="text-xl font-semibold mb-2">Request by: {request.username}</h2>
          <p className="mb-2"><strong>{request.type} request:</strong> {request.messageLink}</p>
          <p className="mb-2"><strong>Status:</strong> {request.status}</p>
        </div>
      ))}
      <div className="mt-4">
        <button className="btn btn-info btn-outline" onClick={() => navigate(-1)}
          >
          <IoMdArrowRoundBack /> Back
        </button>
      </div>
    </div>
  );
}

export default Admin;
