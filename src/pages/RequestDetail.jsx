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
          message: 'You do not have permission to check this this request.',
        });
      });
  }, [requestId]);

  if (!request) {
    return <div className="flex w-52 flex-col gap-4 container mx-auto px-4 py-8">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-32"></div>
      <div className="skeleton h-6 w-34"></div>
      <div className="skeleton h-6 w-36"></div>
      <div className="skeleton h-6 w-38"></div>
      <div className="skeleton h-6 w-40"></div>
      <div className="skeleton h-6 w-42"></div>
      <div className="skeleton h-6 w-44"></div>
      <div className="skeleton h-6 w-46"></div>
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
            <label className="label">Reviewe Message</label>
            <textarea value={request.reviewMessage || "This request hasn't been reviewed yet."} readOnly className="textarea textarea-bordered bg-orange-400" />
          </div>
          <div className="form-control">
            <label className="label">Request</label>
            <input type="text" value={request.status} readOnly className="input input-bordered hover:border-slate-300" />
          </div>
          <div className="form-control">
            <label className="label">Your Username</label>
            <input type="text" value={request.username} readOnly className="input input-bordered border-slate-300" />
          </div>
          <div className="form-control">
            <label className="label">Request / Evidence</label>
            <input type="text" value={request.messageLink} readOnly className="input input-bordered hover:border-sky-700" />
          </div>
          <div className="form-control">
            <label className="label">Anything else you would like to add?</label>
            <textarea value={request.additionalInfo} readOnly className="textarea textarea-bordered hover:border-sky-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetail;
