import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Modal, Spinner, Alert, Input, Textarea, Select } from 'daisyui';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [status, setStatus] = useState('Pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusChange = async (requestId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(
        `https://api.notreal003.xyz/requests/${requestId}`,
        { status, reviewMessage },
        {
          headers: { Authorization: `${token}` },
        }
      );
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status, reviewMessage } : request
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
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
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setReviewMessage(request.reviewMessage || '');
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner className="text-primary" size="xl" />
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-primary">Admin Dashboard</h1>
            <p className="text-lg text-secondary">Manage and review all submitted requests</p>
          </div>

          {requests.length === 0 ? (
            <Alert status="info" className="shadow-lg">
              No requests found.
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((request) => (
                <Card
                  key={request._id}
                  className="p-4 shadow-lg cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => handleRequestClick(request)}
                >
                  <h2 className="text-xl font-semibold mb-2">{request.username}'s Request</h2>
                  <p className="text-sm text-gray-500">Status: {request.status}</p>
                  <p className="text-sm text-gray-500">Submitted At: {new Date(request.createdAt).toLocaleString()}</p>
                </Card>
              ))}
            </div>
          )}

          {selectedRequest && (
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-xl mx-auto">
              <Card className="p-4 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Manage Request</h2>
                <Input className="mb-4" readOnly value={selectedRequest.username} label="Username" />
                <Input className="mb-4" readOnly value={selectedRequest.messageLink} label="Message Link" />
                <Textarea
                  className="mb-4"
                  value={selectedRequest.additionalInfo || 'None'}
                  readOnly
                  label="Additional Info"
                />
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mb-4"
                  label="Status"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
                <Textarea
                  className="mb-4"
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Leave a review message"
                  label="Review Message"
                />

                <div className="flex justify-end space-x-4">
                  <Button className="btn-error" onClick={() => handleDeleteRequest(selectedRequest._id)} disabled={loading}>
                    Delete
                  </Button>
                  <Button className="btn-primary" onClick={() => handleStatusChange(selectedRequest._id)} disabled={loading}>
                    Update Status
                  </Button>
                </div>
              </Card>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
