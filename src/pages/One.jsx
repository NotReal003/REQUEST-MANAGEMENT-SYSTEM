import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaDiscord, FaArrowRight } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDistanceToNow } from 'date-fns';
import { FaPeopleGroup } from "react-icons/fa6";

const RequestStatus = ({ status }) => {
  const statusStyles = {
    DENIED: 'bg-red-600 text-white',
    APPROVED: 'bg-green-600 text-white',
    RESUBMIT_REQUIRED: 'bg-orange-600 text-white',
    PENDING: 'bg-yellow-600 text-white',
    CANCELLED: 'bg-red-600 text-white',
    RESOLVED: 'bg-green-600 text-white',
  };

  const statusTooltips = {
    DENIED: 'Your request was denied.',
    APPROVED: 'Your request was approved.',
    RESUBMIT_REQUIRED: 'Please resubmit your request with necessary changes.',
    PENDING: 'Your request is pending review.',
    CANCELLED: 'Your request was cancelled.',
    RESOLVED: 'Your request was resolved.',
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-bold ${statusStyles[status]}`}
      title={statusTooltips[status]}
    >
      {status}
    </span>
  );
};

const RequestIcon = ({ type }) => {
  if (type === 'report') {
    return <FaDiscord className="text-4xl mr-4" title="Discord Report" />;
  } else if (type === 'guild-application') {
    return <FaPeopleGroup className="text-4xl mr-4" title="Guild Application" />;
  } else if (type === 'support') {
    return <MdSupportAgent className="text-4xl mr-4" title="Support Request" />;
  }
  return null;
};

const One = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://api.notreal003.xyz/requests', {
          headers: { Authorization: `${token}` },
        });

        const filteredRequests = response.data.filter((request) =>
          ['report', 'support', 'guild-application'].includes(request.type)
        );

        const sortedRequests = filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(sortedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to load requests. Please try again later.');
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
      case 'RESOLVED':
        return 'bg-gradient-to-r from-green-600 to-green-700';
      default:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-4">
      <div className="rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Your Requests</h1>
      </div>

      <div className="w-full max-w-3xl">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="loading loading-spinner text-info"></span>
              <p className="font-serif">Please hold on while we are finding your requests...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 font-bold">{error}</p>
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
                    <h2 className="text-lg font-bold">
                      {request.type === 'report' ? `Discord Report` : request.type === 'guild-application' ? 'Guild Application' : 'Support Request'} <RequestStatus status={request.status} />
                    </h2>
                    <p className="text-sm">
                      {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaArrowRight className="ml-2 text-white" />
                </div>
              </div>
            ))
          ) : (
            <p className="min-h-screen text-center text-gray-800">Hold on! You have not submitted any request yet...</p>
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