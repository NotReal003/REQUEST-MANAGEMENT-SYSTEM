import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Select, Textarea, Alert } from 'daisyui';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, navigate]);

  const handleStatusChange = async (requestId) => {
    try {
      await axios.put(
        `https://api.notreal003.xyz/admin/${requestId}`,
        { status, reviewMessage },
        { headers: { Authorization: `${token}` } }
      );
      alert('Request updated successfully');
      // Refresh requests after update
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status, reviewMessage } : req
        )
      );
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    setStatus(request.status || 'Pending');
    setReviewMessage(request.reviewMessage || '');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <div className="text-center">
          <div className="btn btn-primary loading">Loading...</div>
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : requests.length === 0 ? (
        <p>No requests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className={`p-4 shadow-lg ${selectedRequest?._id === request._id ? 'border-2 border-primary' : ''}`}
            >
              <h2 className="text-xl font-semibold">{request.username}'s Request</h2>
              <p className="mt-2"><strong>Message Link:</strong> {request.messageLink}</p>
              <p><strong>Additional Info:</strong> {request.additionalInfo || 'None provided'}</p>
              <p><strong>Status:</strong> {request.status}</p>

              {selectedRequest?._id === request._id ? (
                <div className="mt-4">
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mb-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Select>

                  <Textarea
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    placeholder="Leave a review message"
                    className="mb-2"
                  />

                  <div
                    onClick={() => handleStatusChange(request._id)}
                    className="btn btn-primary"
                  >
                    Update Status
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => handleRequestSelect(request)}
                  className="btn btn-secondary mt-4"
                >
                  Manage Request
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
