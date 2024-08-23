import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import RequestDetailModal from './components/RequestDetailModal';

function Admin() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
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

        if (userResponse.data && userResponse.data.isAdmin) {
          const requestResponse = await axios.get(
            'https://api.notreal003.xyz/admin/requests',
            { headers: { Authorization: `${jwtToken}` } }
          );
          setRequests(requestResponse.data);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/404');
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleRequestClick = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleModalClose = () => {
    setSelectedRequestId(null);
    // Refresh requests after closing modal
    fetchRequests();
  };

  const filteredRequests = requests
    .filter(
      (request) =>
        request.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterStatus === '' || request.status === filterStatus)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-4">
        <button className="btn btn-outline btn-info" onClick={() => navigate('/admin')}>
          <IoMdArrowRoundBack size={24} className="mr-2" /> Back to Admin Dashboard
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <select
          className="select select-bordered w-full"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="DENIED">Denied</option>
          <option value="PENDING">Pending</option>
          <option value="RESUBMIT_REQUIRED">Resubmit Required</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request._id} className="cursor-pointer">
                <td>{request.username}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-info btn-outline"
                    onClick={() => handleRequestClick(request._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequestId && (
        <RequestDetailModal
          requestId={selectedRequestId}
          onClose={handleModalClose}
          refreshRequests={fetchRequests}
        />
      )}
    </div>
  );
}

export default Admin;
