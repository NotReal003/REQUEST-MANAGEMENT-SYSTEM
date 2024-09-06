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
    DENIED: 'Request was denied.',
    APPROVED: 'Request was approved.',
    RESUBMIT_REQUIRED: 'Please resubmit with changes.',
    PENDING: 'Request is pending.',
    CANCELLED: 'Request was cancelled.',
    RESOLVED: 'Request was resolved.',
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
  const iconClass = "text-2xl sm:text-3xl md:text-4xl mr-2 sm:mr-3 md:mr-4";
  if (type === 'report') {
    return <FaDiscord className={iconClass} title="Discord Report" />;
  } else if (type === 'guild-application') {
    return <FaPeopleGroup className={iconClass} title="Guild Application" />;
  } else if (type === 'support') {
    return <MdSupportAgent className={iconClass} title="Support Request" />;
  }
  return null;
};

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [apiClosed, setApiClosed] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  const handleApiToggle = async () => {
    try {
      const response = await axios.post(
        'https://api.notreal003.xyz/server/manage-api',
        { closeType: !apiClosed },
        { headers: { Authorization: `${token}` } }
      );
      setApiClosed(response.data.closed);
    } catch (err) {
      console.error('Error toggling API status:', err);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://api.notreal003.xyz/admin/requests', {
          headers: { Authorization: `${token}` },
        });

        let filteredRequests = response.data;

        // Filter requests by status
        if (statusFilter) {
          filteredRequests = filteredRequests.filter((request) => request.status === statusFilter);
        }

        // Filter requests by user ID
        if (userIdFilter) {
          filteredRequests = filteredRequests.filter((request) => request.userId === userIdFilter);
        }

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
  }, [token, statusFilter, userIdFilter]);

  const handleRequestClick = (id) => {
    navigate(`/admindetail?id=${id}`);
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
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="rounded-lg shadow-sm w-full max-w-3xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Admin Dashboard - Manage Requests</h1>
        <div className="mb-4 flex flex-col sm:flex-row justify-between">
          <div className="space-x-2">
            <select
              className="select select-bordered select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="DENIED">Denied</option>
              <option value="RESUBMIT_REQUIRED">Resubmit Required</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <input
              type="text"
              className="input input-bordered input-sm"
              placeholder="Filter by User ID"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
            />
          </div>
          <button className="btn btn-sm btn-outline" onClick={handleApiToggle}>
            {apiClosed ? 'noopened' : 'yesclosed'}
          </button>
        </div>
      </div>
      <div className="w-full max-w-3xl">
        <div className="space-y-2 sm:space-y-4">
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="loading loading-spinner text-info"></span>
              <p className="text-sm sm:text-base">Please hold on while we are fetching requests...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-6.364 6.364m0 0L5.636 18.364m6.364-6.364l6.364 6.364M6.636 5.636L18.364 17.364" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className={`flex justify-between items-center p-2 sm:p-3 md:p-4 rounded-lg shadow-lg text-white ${getGradientClass(request.status)} cursor-pointer`}
                onClick={() => handleRequestClick(request._id)}
              >
                <div className="flex items-center">
                  <RequestIcon type={request.type} />
                  <div>
                    <h2 className="text-sm sm:text-base md:text-lg font-bold">
                      {request.type === 'report' ? `Discord Report` : request.type === 'guild-application' ? 'Guild Application' : 'Support Request'} <RequestStatus status={request.status} />
                    </h2>
                    <p className="text-xs sm:text-sm">
                      {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaArrowRight className="ml-2 text-white text-sm sm:text-base" />
                </div>
              </div>
            ))
          ) : (
            <p className="min-h-screen text-center text-gray-800 text-sm sm:text-base">No requests found.</p>
          )}
        </div>
        <div className="mt-4">
          <button className="btn btn-info btn-outline btn-sm sm:btn-md" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
