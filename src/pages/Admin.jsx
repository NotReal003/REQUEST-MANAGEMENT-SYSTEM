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

        // Check if user is admin
        if (user.id === '1131271104590270606' || user.isAdmin) {
          user.isAdmin = true;
        }

        if (!user.isAdmin) {
          navigate('/404');
        } else {
          const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
            headers: { Authorization: `${token}` },
          });

          console.log('Requests Data:', requestsResponse.data); // Debugging

          // Ensure requestsResponse.data is an array
          if (Array.isArray(requestsResponse.data)) {
            setRequests(requestsResponse.data);
          } else {
            console.error('Unexpected data format for requests:', requestsResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching requests or user data:', error);
        navigate('/404');
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
        {requests.length > 0 ? (
          requests.map((request) => {
            // Safeguard against invalid data
            const { _id, username, messageLink, additionalInfo, status } = request || {};
            return (
              <Card key={_id} className="p-4 shadow-lg">
                <h2 className="text-xl font-semibold">{username || 'Unknown User'}'s Request</h2>
                <p>Message Link: {messageLink || 'No message link provided'}</p>
                <p>Additional Info: {additionalInfo || 'None provided'}</p>
                <p>Status: {status || 'Unknown'}</p>

                {selectedRequest?._id === _id ? (
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
                      onClick={() => handleStatusChange(_id)}
                      className="btn-primary"
                    >
                      Update Status
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedRequest(request);
                      setStatus(request.status || 'Pending');
                      setReviewMessage(request.reviewMessage || '');
                    }}
                    className="btn-secondary mt-2"
                  >
                    Manage Request
                  </Button>
                )}
              </Card>
            );
          })
        ) : (
          <p>No requests available.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
