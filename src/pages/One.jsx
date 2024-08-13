import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaDiscord, FaArrowRight } from 'react-icons/fa';
import { MdSupportAgent } from "react-icons/md";

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

const RequestIcon = ({ type }) => {
  if (type === 'report') {
    return <FaDiscord className="text-4xl mr-4" />;
  } else if (type === 'support') {
    return <MdSupportAgent className="text-4xl mr-4" />;
  }
  return null;
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
        // Sort requests by the creation
        const sortedRequests = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(sortedRequests);
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
                <RequestIcon type={request.type} />
                <div>
                  <h2 className="text-lg font-bold">{request.type === 'report' ? 'Discord Report' : 'Support Request'}</h2>
                  <p className="text-sm">
                    {new Date(request.createdAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Kolkata',
                      hour12: true,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <RequestStatus status={request.status} />
                <Link to={`/requestdetail?id=${request._id}`} className="ml-4">
                  <FaArrowRight className="text-white" />
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
