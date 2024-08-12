import React, { useEffect, useState } from 'react';
import axios from 'axios';

function One() {
  const [requests, setRequests] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    axios.get('https://api.notreal003.xyz/requests', {
        headers: { Authorization: `${token}` },
      })
      .then(response => setRequests(response.data))
      .catch(() => {
        setAlert({
          type: 'error',
          message: 'Failed to fetch requests. Please try again later.',
        });
      });
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.username}</td>
                <td>{request.messageLink}</td>
                <td>{request.additionalInfo || 'None provided'}</td>
                <td>{request.status}</td>
                <td>{request.reviewMessage || 'No review message provided.'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default One;
