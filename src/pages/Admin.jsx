import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [requests, setRequests] = useState([]);
  const [reviewMessage, setReviewMessage] = useState('');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          navigate('/login');
          return;
        }

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
      } catch {
        setAlert({
          type: 'error',
          message: 'Failed to fetch requests or user data. Please try again later.',
        });
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleReview = async (requestId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`https://api.notreal003.xyz/admin/${requestId}`, { reviewMessage }, {
        headers: { Authorization: `${token}` },
      });
      setAlert({
        type: 'success',
        message: 'Request reviewed successfully!',
      });
      setReviewMessage('');
    } catch {
      setAlert({
        type: 'error',
        message: 'Failed to review request. Please try again later.',
      });
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`https://api.notreal003.xyz/admin/${requestId}`, {
        headers: { Authorization: `${token}` },
      });
      setRequests(requests.filter(request => request._id !== requestId));
      setAlert({
        type: 'success',
        message: 'Request deleted successfully.',
      });
    } catch {
      setAlert({
        type: 'error',
        message: 'Failed to delete request. Please try again later.',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && (
        <div className={`alert alert-${alert.type} shadow-lg mb-4`}>
          <div>
            <span>{alert.message}</span>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>Message Link</th>
              <th>Additional Info</th>
              <th>Status</th>
              <th>Review Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.username}</td>
                <td>{request.messageLink}</td>
                <td>{request.additionalInfo || 'None provided'}</td>
                <td>{request.status}</td>
                <td>{request.reviewMessage || 'No review yet'}</td>
                <td>
                  <textarea
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    placeholder="Leave a review message"
                    className="input input-bordered w-full max-w-xs mb-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleReview(request._id)}
                    >
                      Review
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(request._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
