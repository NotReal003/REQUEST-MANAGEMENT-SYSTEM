import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const userResponse = await axios.get('https://api.notreal003.xyz/users/@me', {
          headers: { Authorization: `${token}` },
        });

        const user = userResponse.data;

    if (user.id === '1131271104590270606' || user.isAdmin) {
          user.isAdmin = true;  // Ensure isAdmin is true if the user ID matches
        }

        if (!user.isAdmin) {
          navigate('/404'); // Redirect non-admin users to the 404 page
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
      await axios.put(`https://api.notreal003.xyz/admin/${requestId}`, { status: newStatus }, {
        headers: { Authorization: `${token}` },
      });
      // Update the request status locally after successful API call
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: newStatus } : request
        )
      );
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.delete(`https://api.notreal003.xyz/admin/${requestId}`, {
          headers: { Authorization: `${token}` },
        });
        // Remove the deleted request from the local state
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
      } catch (error) {
        console.error('Error deleting request:', error);
        alert('Failed to delete request. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-primary">Dashboard</h1>
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
                <tr key={request._id}>
                  <td className="text-sm font-semibold">{request.id}</td>
                  <td>
                    <a href={request.messageLink} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
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
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteRequest(request._id)}
                        disabled={loading}
                      >
                        Delete
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
