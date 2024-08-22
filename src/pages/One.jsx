import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDiscord, FaArrowRight } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const RequestStatus = ({ status }) => {
  const statusStyles = {
    DENIED: 'bg-red-600 text-white',
    APPROVED: 'bg-green-600 text-white',
    RESUBMIT_REQUIRED: 'bg-orange-600 text-white',
    PENDING: 'bg-yellow-600 text-white',
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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://api.notreal003.xyz/requests', {
          headers: { Authorization: `${token}` },
        });
        // Sort requests by the creation date, showing the newest at the top
        const sortedRequests = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(sortedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleRequestClick = (id) => {
    navigate(`/requestdetail?id=${id}`);
  };

  const getGradientClass = (status) => {
    switch (status) {
      case 'DENIED':
        return 'bg-gradient-to-r from-red-600 to-red-700';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-orange-600 to-orange-700';
      case 'APPROVED':
        return 'bg-gradient-to-r from-green-600 to-green-700';
      case 'RESUBMIT_REQUIRED':
        return 'bg-gradient-to-r from-orange-600 to-orange-700';
      default:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="hidden sm:block bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Requests</h1>

        <div className="space-y-4">
          {loading ? (
            <span className="loading loading-spinner text-info"></span>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className={`flex justify-between items-center p-4 rounded-lg shadow-lg text-white ${getGradientClass(request.status)} cursor-pointer`}
                onClick={() => handleRequestClick(request._id)}
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
                  <FaArrowRight className="ml-4 text-white" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-800">Hold on! You have not submitted any request yet...</p>
          )}
        </div>
        <div className="mt-4">
          <button className="btn btn-info btn-outline" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack className="mr-2" />Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default One;
