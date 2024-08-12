import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Select, Textarea, Button } from 'daisyui';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [status, setStatus] = useState('Pending');
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
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
        console.error('Error fetching requests:', error);
        navigate('/404'); // Redirect if there's an error
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
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((request) => (
          <Card key={request._id} className="p-4 shadow-lg">
            <h2 className="text-xl font-semibold">{request.username}'s Request</h2>
            <p>Message Link: {request.messageLink}</p>
            <p>Additional Info: {request.additionalInfo || 'None provided'}</p>
            <p>Status: {request.status}</p>

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

                <Button
                  onClick={() => handleStatusChange(request._id)}
                  className="btn-primary"
                >
                  Update Status
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setSelectedRequest(request)}
                className="btn-secondary mt-2"
              >
                Manage Request
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;
