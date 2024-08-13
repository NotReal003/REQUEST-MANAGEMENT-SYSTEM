import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [requests, setRequests] = useState([]);
  const [reviewMessage, setReviewMessage] = useState('');
  const [status, setStatus] = useState('');
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
          user.isAdmin = true;  // Ensure isAdmin is true if the user ID matches
        }

        if (!user.isAdmin) {
          navigate('/404'); // Redirect non-admin users to the 404 page
        } else {
          const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
            headers: { Authorization: `${jwtToken}` },
          });
          setRequests(requestsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleStatusChange = async (requestId) => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken || !status) {
      return;
    }

    try {
      await axios.put(
        `https://api.notreal003.xyz/admin/${requestId}`,
        { status, reviewMessage },
        { headers: { Authorization: `${jwtToken}` } }
      );
      // Refresh the requests list after update
      const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
        headers: { Authorization: `${jwtToken}` },
      });
      setRequests(requestsResponse.data);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      return;
    }

    try {
      await axios.delete(`https://api.notreal003.xyz/admin/${requestId}`, {
        headers: { Authorization: `${jwtToken}` },
      });
      // Refresh the requests list after deletion
      const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
        headers: { Authorization: `${jwtToken}` },
      });
      setRequests(requestsResponse.data);
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {requests.map((request) => (
        <div key={request._id} className="p-4 bg-white shadow rounded mb-4">
          <h2 className="text-xl font-semibold mb-2">Request by {request.username}</h2>
          <p className="mb-2"><strong>Message Link:</strong> {request.messageLink}</p>
          <p className="mb-2"><strong>Additional Info:</strong> {request.additionalInfo}</p>
          <p className="mb-2"><strong>Status:</strong> {request.status}</p>
          <p className="mb-2"><strong>Review Message:</strong> {request.reviewMessage || 'No review message yet'}</p>
          <div className="mt-4">
            <label htmlFor="status" className="block mb-1">Update Status:</label>
            <select
              id="status"
              className="block w-full border border-gray-300 rounded px-2 py-1 mb-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled>{request.status}</option>
              <option value="APPROVED">Accept</option>
              <option value="REJECTED">Reject</option>
              <option value="PENDING">Pending</option>
            </select>
            <label htmlFor="reviewMessage" className="block mb-1">Review Message:</label>
            <textarea
              id="reviewMessage"
              className="block w-full border border-gray-300 rounded px-2 py-1 mb-2"
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              placeholder="Leave a review message"
            />
            <button
              className="btn btn-primary mr-2"
              onClick={() => handleStatusChange(request._id)}
            >
              Update Request
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteRequest(request._id)}
            >
              Delete Request
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;
