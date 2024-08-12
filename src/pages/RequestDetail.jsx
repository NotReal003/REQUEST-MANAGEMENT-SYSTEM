import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function RequestDetail() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');
    const token = localStorage.getItem('jwtToken');
axios.get(`https://api.notreal003.xyz/requests/${requestId}`, {
        headers: { Authorization: `${token}` },
      })
      .then(response => setRequest(response.data))
      .catch(() => {
        setAlert({
          type: 'error',
          message: 'Failed to fetch request details. Please try again later.',
        });
      });
  }, [requestId]);

  if (!request) {
    return <div className="flex w-52 flex-col gap-4 flex items-center justify-center">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && (
        <div className={`alert alert-${alert.type} shadow-lg mb-4`}>
          <div>
            <span>{alert.message}</span>
          </div>
        </div>
      )}
      <div className="card shadow-lg bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Request Details</h2>
          <div className="form-control">
            <label className="label">Review Message</label>
            <textarea value={request.reviewMessage || 'No review yet'} readOnly className="textarea textarea-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Username</label>
            <input type="text" value={request.username} readOnly className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Message Link</label>
            <input type="text" value={request.messageLink} readOnly className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Additional Info</label>
            <textarea value={request.additionalInfo || 'None provided'} readOnly className="textarea textarea-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Status</label>
            <input type="text" value={request.status} readOnly className="input input-bordered" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetail;
