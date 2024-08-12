import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
          user.isAdmin = true;
        }

        if (!user.isAdmin) {
          navigate('/404');
        } else {
          const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
            headers: { Authorization: `${token}` },
          });
          setRequests(requestsResponse.data);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to fetch data');
      }
    };

    fetchRequests();
  }, [navigate, token]);

  const handleStatusChange = async (requestId, status, reviewMessage) => {
    try {
      await axios.put(`https://api.notreal003.xyz/requests/${requestId}`, { status, reviewMessage }, {
        headers: { Authorization: `${token}` },
      });
      // Update the status and review message in the UI
      setRequests(prevRequests => prevRequests.map(request =>
        request._id === requestId ? { ...request, status, reviewMessage } : request
      ));
    } catch (error) {
      setError('Failed to update status or review message');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(request => (
            <div key={request._id} className="card shadow-lg p-4">
              <h2 className="text-xl font-semibold">Request by {request.username}</h2>
              <p className="mb-2"><strong>Message Link:</strong> {request.messageLink}</p>
              <p className="mb-2"><strong>Additional Info:</strong> {request.additionalInfo || 'None'}</p>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={request.status}
                  onChange={(e) => handleStatusChange(request._id, e.target.value, request.reviewMessage)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Review Message</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={request.reviewMessage || ''}
                  onChange={(e) => handleStatusChange(request._id, request.status, e.target.value)}
                  placeholder="Leave a review message here"
                ></textarea>
              </div>
              {request.reviewMessage && (
                <div className="alert alert-info mt-4">
                  <span><strong>Review Message:</strong> {request.reviewMessage}</span>
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
