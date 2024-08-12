import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const One = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://api.notreal003.xyz/requests', {
          headers: { Authorization: `${token}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="card bg-base-100 shadow-xl p-4">
              <h2 className="text-xl font-semibold">{request.username}'s Request</h2>
              <p>Status: {request.status}</p>
              <p>Review Message: {request.reviewMessage || 'No review message yet'}</p>

              <Link
                to={`/requestdetail?id=${request._id}`}
                className="btn btn-primary mt-2"
              >
                View Request Details
              </Link>
            </div>
          ))
        ) : (
          <p>No requests found.</p>
        )}
      </div>
    </div>
  );
};

export default One;
