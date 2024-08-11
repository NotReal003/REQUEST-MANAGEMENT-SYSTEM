import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        const userResponse = await axios.get('https://api.notreal003.xyz/users/@me', {
          headers: {
            Authorization: `${jwtToken}`
          }
        });

        const adminUserId = "1131271104590270606"; // Replace with the actual admin user ID

        if (userResponse.data.id !== adminUserId) {
          navigate('/404');
          return;
        }

        const requestsResponse = await axios.get('https://api.notreal003.xyz/requests', {
          headers: {
            Authorization: `${jwtToken}`
          }
        });

        setRequests(requestsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <button className="btn loading">Loading...</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Message Link</th>
              <th>Additional Info</th>
              <th>Status</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((request, index) => (
                <tr key={request._id}>
                  <td>{index + 1}</td>
                  <td>{request.id}</td>
                  <td>
                    <a href={request.messageLink} className="link link-primary">
                      {request.messageLink}
                    </a>
                  </td>
                  <td>{request.additionalInfo || 'None provided'}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === 'Pending'
                          ? 'badge-warning'
                          : request.status === 'Approved'
                          ? 'badge-success'
                          : 'badge-error'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateRequestStatus(request._id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => updateRequestStatus(request._id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const updateRequestStatus = async (requestId, status) => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    await axios.put(
      `https://api.notreal003.xyz/admin/${requestId}`,
      { status },
      {
        headers: {
          Authorization: `${jwtToken}`
        }
      }
    );
    window.location.reload();
  } catch (err) {
    alert('Failed to update request status. Please try again later.');
  }
};

export default Admin;
