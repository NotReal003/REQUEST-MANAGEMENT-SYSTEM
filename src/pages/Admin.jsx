import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Button, Badge } from 'daisyui';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusChange = async (requestId, newStatus, reviewMessage = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`https://api.notreal003.xyz/requests/${requestId}`, 
        { status: newStatus, reviewMessage }, 
        { headers: { Authorization: `${token}` } }
      );
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: newStatus, reviewMessage } : request
        )
      );
      setNotification({ type: 'success', message: 'Request updated successfully!' });
    } catch (error) {
      console.error('Error updating request status:', error);
      setNotification({ type: 'error', message: 'Failed to update request status.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`https://api.notreal003.xyz/requests/${requestId}`, {
        headers: { Authorization: `${token}` },
      });
      setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
      setNotification({ type: 'success', message: 'Request deleted successfully!' });
    } catch (error) {
      console.error('Error deleting request:', error);
      setNotification({ type: 'error', message: 'Failed to delete request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-8 text-primary animate-fade-in">
              Admin Dashboard
            </h1>
            <p className="text-lg text-secondary animate-fade-in">
              Manage and review all submitted requests
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="flex justify-center items-center h-64 animate-fade-in">
              <span className="text-lg text-gray-500">No requests found.</span>
            </div>
          ) : (
            <div className="overflow-x-auto animate-slide-in">
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
                        <Badge className={getStatusBadgeClass(request.status)}>
                          {request.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="btn-success"
                            onClick={() => handleStatusChange(request._id, 'Approved')}
                            disabled={loading || request.status === 'Approved'}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="btn-error"
                            onClick={() => handleStatusChange(request._id, 'Rejected')}
                            disabled={loading || request.status === 'Rejected'}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="btn-warning"
                            onClick={() => handleStatusChange(request._id, 'Pending')}
                            disabled={loading || request.status === 'Pending'}
                          >
                            Pending
                          </Button>
                          <Button
                            size="sm"
                            className="btn-danger"
                            onClick={() => {
                              setSelectedRequest(request._id);
                              setModalOpen(true);
                            }}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                      <td>{new Date(request.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="my-4">Are you sure you want to delete this request?</p>
            <div className="flex justify-end space-x-4">
              <Button
                size="sm"
                className="btn-error"
                onClick={() => {
                  handleDeleteRequest(selectedRequest);
                  setModalOpen(false);
                }}
              >
                Yes, Delete
              </Button>
              <Button
                size="sm"
                className="btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
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
