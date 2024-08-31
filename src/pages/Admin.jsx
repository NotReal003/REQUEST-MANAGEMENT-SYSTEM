import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';

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
        const requestsResponse = await axios.get('https://api.notreal003.xyz/admin/requests', {
          headers: { Authorization: `${jwtToken}` },
          params: {
            page: currentPage,
            limit: requestsPerPage,
            sortField,
            sortOrder,
            searchQuery,
            filterStatus,
          },
        });

        setRequests(requestsResponse.data);
        setTotalRequests(requestsResponse.data.totalRequests);
      } else {
        toast.warn('API is currently closed. You cannot view or manage requests.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [navigate, currentPage, requestsPerPage, sortField, sortOrder, searchQuery, filterStatus]);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex flex-col md:flex-row mb-4 gap-4">
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
          <table className="table w-full">
            <thead>
              <tr>
                <th onClick={() => handleSort('username')}>Username</th>
                <th onClick={() => handleSort('type')}>Type</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th onClick={() => handleSort('createdAt')}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className={`cursor-pointer hover:bg-gray-100 ${
                    request.status === 'APPROVED'
                      ? 'bg-green-500'
                      : request.status === 'DENIED'
                      ? 'bg-red-500'
                      : request.status === 'CANCELLED'
                      ? 'bg-yellow-500'
                      : ''
                  }`}
                  onClick={() => handleRequestClick(request._id)}
                >
                  <td>{request.username}</td>
                  <td>{request.type}</td>
                  <td>{request.status}</td>
                  <td>
                    {new Date(request.createdAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Kolkata',
                      hour12: true,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
