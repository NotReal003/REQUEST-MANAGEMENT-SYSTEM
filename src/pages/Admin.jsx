import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Select, Textarea, Alert } from 'daisyui';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
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
        setError('Failed to fetch requests. Please try again later.');
        console.error('Error fetching data:', error);
      }
    };

    fetchRequests();
  }, [token, navigate]);

  const handleStatusChange = async (requestId, newStatus, reviewMessage) => {
    try {
      await axios.put(
        `https://api.notreal003.xyz/admin/${requestId}`,
        { status: newStatus, reviewMessage },
        { headers: { Authorization: `${token}` } }
      );
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: newStatus, reviewMessage } : request
        )
      );
      alert('Request updated successfully');
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error ? (
        <Alert className="alert alert-error">{error}</Alert>
      ) : requests.length === 0 ? (
        <p>No requests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <Card key={request._id} className="p-4 shadow-lg">
              <h2 className="text-xl font-semibold">{request.username}'s Request</h2>
              <p className="mt-2"><strong>Message Link:</strong> {request.messageLink}</p>
              <p><strong>Additional Info:</strong> {request.additionalInfo || 'None provided'}</p>
              <p><strong>Status:</strong> {request.status}</p>

              <div className="mt-4">
                <Select
                  value={request.status}
                  onChange={(e) => handleStatusChange(request._id, e.target.value, request.reviewMessage)}
                  className="mb-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>

                <Textarea
                  value={request.reviewMessage || ''}
                  onChange={(e) => handleStatusChange(request._id, request.status, e.target.value)}
                  placeholder="Leave a review message"
                  className="mb-2"
                />

                <Button className="btn btn-primary" onClick={() => handleStatusChange(request._id, request.status, request.reviewMessage)}>
                  Update Status
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
