import React, { useEffect, useState } from 'react';
import axios from 'axios';

const One = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('https://api.notreal003.xyz/requests', {
          headers: {
            Authorization: `${token}`
          }
        });

        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch requests. Please try again later.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-4">Your Submitted Requests</h1>
        <p className="text-gray-600">Below is a summary of the requests you've submitted.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Message Link</th>
              <th>Additional Information</th>
              <th>Status</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-lg text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((request, index) => (
                <tr key={request._id}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={request.messageLink} className="link link-primary" target="_blank" rel="noopener noreferrer">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default One;
