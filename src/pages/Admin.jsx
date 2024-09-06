import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';
import { FaDiscord, FaArrowRight } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDistanceToNow } from 'date-fns';
import { FaPeopleGroup } from "react-icons/fa6";

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [apiClosed, setApiClosed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
  const [totalRequests, setTotalRequests] = useState(0);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

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

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      navigate('/404');
      return;
    }

    try {
      const [userResponse, apiStatusResponse] = await Promise.all([
        axios.get('https://api.notreal003.xyz/users/@me', {
          headers: { Authorization: `${jwtToken}` },
        }),
        axios.get('https://api.notreal003.xyz/server/manage-api', {
          headers: { Authorization: `${jwtToken}` },
        }),
      ]);

      const user = userResponse.data;
      if (user.id === '1131271104590270606' || user.isAdmin) {
        user.isAdmin = true;
      }

      if (!user.isAdmin) {
        navigate('/404');
        return;
      }

      setApiClosed(apiStatusResponse.data.message.serverClosed === 'yesclosed');

      if (apiStatusResponse.data.message.serverClosed !== 'yesclosed') {
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestClick = (requestId) => {
    navigate(`/admindetail?id=${requestId}`);
  };

  const handleToggleApiStatus = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    try {
      const response = await axios.put(
        'https://api.notreal003.xyz/server/manage-api',
        { closeType: apiClosed ? 'noopened' : 'yesclosed' },
        {
          headers: { Authorization: `${jwtToken}` },
        }
      );
      if (response.status === 200) {
        toast.success(`API has been ${apiClosed ? 'opened' : 'closed'} successfully.`);
        setApiClosed(!apiClosed);
      } else {
        toast.error('Failed to change API status.');
      }
    } catch (error) {
      console.error('Error changing API status:', error);
      toast.error('An error occurred while changing API status.');
    }
  };

  const debouncedSearch = debounce((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleRequestClick = (id) => {
    navigate(`/admindetail?id=${id}`);
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex flex-col md:flex-row mb-4 gap-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by User ID"
          className="input input-bordered w-full max-w-xs"
          onChange={handleSearchChange}
        />
        <select
          className="select select-bordered"
          onChange={handleFilterChange}
        >
          <option value="">Filter by Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="DENIED">Denied</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="label cursor-pointer">
          <span className="label-text text-xl mr-4">API Status:</span> 
          <input
            type="checkbox"
            className="toggle toggle-info"
            checked={!apiClosed}
            onChange={handleToggleApiStatus}
          />
        </label>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner text-info"></span>
        </div>
      ) : requests.length > 0 ? (
        <>
          <div
                key={request._id}
                className={`flex justify-between items-center p-4 bg rounded-lg shadow-lg max-w-md md:max-w-lg mx-auto text-white shadow-lg ${getGradientClass(request.status)} cursor-pointer`}
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
          <div className="flex justify-between items-center mt-4">
            <div>
              <button
                className={`btn ${currentPage === 1 ? 'btn-disabled' : 'btn-info'}`}
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </button>
              <span className="mx-4">
                Page {currentPage} of {Math.ceil(totalRequests / requestsPerPage)}
              </span>
              <button
                className={`btn ${
                  currentPage >= Math.ceil(totalRequests / requestsPerPage)
                    ? 'btn-disabled'
                    : 'btn-info'
                }`}
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </button>
            </div>
            <button className="btn btn-info btn-outline" onClick={() => navigate(-1)}>
              <IoMdArrowRoundBack className="mr-2" />
              Back
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-800">No requests found for the selected filters.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default Admin;
