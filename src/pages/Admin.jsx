import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const userResponse = await axios.get('https://api.notreal003.xyz/users/@me', {
          headers: { Authorization: `${token}` },
        });

        const user = userResponse.data;

          if (user.id !== '1131271104590270606' && !user.isAdmin) {
            navigate('/404');
        } else {
          const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
            headers: { Authorization: `${token}` },
          });
          setRequests(requestsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/404'); // Redirect in case of error
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusChange = async (requestId, newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(
        `https://api.notreal003.xyz/admin/${requestId}`,
        { status: newStatus, reviewMessage },
        {
          headers: { Authorization: `${token}` },
        }
      );
      // Update the request status locally after successful API call
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: newStatus, reviewMessage } : request
        )
      );
      setSelectedRequest(null); // Clear the selected request after update
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    setReviewMessage(e.target.value);
  };

  const selectRequest = (request) => {
    setSelectedRequest(request);
    setReviewMessage(request.reviewMessage || '');
  };

  return (
    <div className="container mx-auto p-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-primary">Admin Dashboard</h1>
        <p className="text-lg text-secondary">Manage and review all submitted requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-lg text-gray-500">No requests found.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full mt-8 shadow-lg rounded-lg">
            <thead>
              <tr>
                <th className="bg-primary text-white">ID</th>
                <th className="bg-primary text-white">Message Link</th>
                <th className="bg-primary text-white">Additional Info</th>
                <th className="bg-primary text-white">Status</th>
                <th className="bg-primary text-white">Actions</th>
                <th className="bg-primary text-white">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} onClick={() => selectRequest(request)}>
                  <td className="text-sm font-semibold">{request.id}</td>
                  <td>
                    <a
                      href={request.messageLink}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {request.messageLink}
                    </a>
                  </td>
                  <td>{request.additionalInfo || 'None'}</td>
                  <td>
                    <span className={`badge badge-lg ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusChange(request._id, 'Approved')}
                        disabled={loading || request.status === 'Approved'}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleStatusChange(request._id, 'Rejected')}
                        disabled={loading || request.status === 'Rejected'}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleStatusChange(request._id, 'Pending')}
                        disabled={loading || request.status === 'Pending'}
                      >
                        Pending
                      </button>
                    </div>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <div className="mt-8 p-4 border rounded-lg shadow-md bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Review Request</h2>
          <p className="mb-2"><strong>ID:</strong> {selectedRequest.id}</p>
          <p className="mb-2"><strong>Message Link:</strong> {selectedRequest.messageLink}</p>
          <p className="mb-2"><strong>Status:</strong> {selectedRequest.status}</p>
          <textarea
            className="textarea textarea-bordered w-full mt-4"
            placeholder="Leave a review message"
            value={reviewMessage}
            onChange={handleReviewChange}
          />
          <div className="flex space-x-2 mt-4">
            <button
              className="btn btn-success"
              onClick={() => handleStatusChange(selectedRequest._id, 'Approved')}
              disabled={loading}
            >
              Save Review & Approve
            </button>
            <button
              className="btn btn-error"
              onClick={() => handleStatusChange(selectedRequest._id, 'Rejected')}
              disabled={loading}
            >
              Save Review & Reject
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleStatusChange(selectedRequest._id, 'Pending')}
              disabled={loading}
            >
              Save Review & Mark as Pending
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to get the appropriate badge class based on the status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'badge-success';
    case 'Rejected':
      return 'badge-error';
    default:
      return 'badge-warning';
  }
};

export default Admin;
