import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(5);
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
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleRequestClick = (requestId) => {
    navigate(`/admindetail?id=${requestId}`);
  };

  const filteredRequests = requests.filter((request) => {
    return (
      (!searchQuery || request.id.includes(searchQuery)) &&
      (!filterStatus || request.status === filterStatus)
    );
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by User ID"
          className="input input-bordered w-full max-w-xs"
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

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner text-info"></span>
        </div>
      ) : currentRequests.length > 0 ? (
        <>
          {currentRequests.map((request) => (
            <div
              key={request._id}
              className={`p-4 shadow-lg rounded-lg mb-4 cursor-pointer transition-transform hover:scale-105 ${
                request.status === 'APPROVED'
                  ? 'bg-green-700'
                  : request.status === 'DENIED'
                  ? 'bg-red-700'
                  : request.status === 'CANCELLED'
                  ? 'bg-yellow-700'
                  : 'bg-gray-700'
              }`}
              onClick={() => handleRequestClick(request._id)}
            >
              <h2 className="text-xl font-semibold mb-2">
                Request by: {request.username}
              </h2>
              <p className="mb-2">
                <strong>{request.type} request:</strong> {request.messageLink}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {request.status}
              </p>
              <p className="text-sm">
                <strong>Submitted:</strong>{' '}
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
          ))}
          <div className="flex justify-between items-center mt-4">
            <div>
              <button
                className={`btn ${currentPage === 1 ? 'btn-disabled' : 'btn-info'}`}
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className={`btn ${
                  currentRequests.length < requestsPerPage
                    ? 'btn-disabled'
                    : 'btn-info'
                } ml-2`}
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
    </div>
  );
};

export default Admin;
