import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RequestStatus = ({ status }) => {
  const statusStyles = {
    DENIED: 'bg-red-600 text-white',
    APPROVED: 'bg-green-600 text-white',
    RESUBMIT_REQUIRED: 'bg-orange-500 text-white',
    PENDING: 'bg-yellow-500 text-white',
    CANCELLED: 'bg-red-600 text-white',
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

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
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>

      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-lg text-white ${
                request.status === 'DENIED' || request.status === 'CANCELLED'
                  ? 'bg-red-500'
                  : request.status === 'APPROVED'
                  ? 'bg-green-500'
                  : 'bg-orange-500'
              }`}
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">
                  {/* Assuming you use an icon library for the Discord icon */}
                  <i className="fab fa-discord"></i>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Discord Report</h2>
                  <p className="text-sm">
                    {new Date(request.createdAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Kolkata',
                      hour12: true,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <RequestStatus status={request.status} />
                <Link to={`/requestdetail?id=${request._id}`} className="ml-4">
                  <i className="fas fa-arrow-right text-white"></i>
                </Link>
              </div>
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
