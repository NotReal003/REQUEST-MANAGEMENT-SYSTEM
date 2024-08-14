import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AdminDetail() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const [status, setStatus] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const urlParams = new URLSearchParams(window.location.search);
        const reqId = urlParams.get('id');
        const response = await axios.get(`https://api.notreal003.xyz/requests/${reqId}`, {
          headers: { Authorization: `${token}` },
        });
        setRequest(response.data);
        setStatus(response.data.status);
        setReviewMessage(response.data.reviewMessage || '');
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Error while fetching the request details.',
        });
      }
    };

    fetchRequest();
  }, [requestId]);

  const handleUpdateRequest = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const urlParams = new URLSearchParams(window.location.search);
      const reqId = urlParams.get('id');
      await axios.put(
        `https://api.notreal003.xyz/admin/${reqId}`,
        { status, reviewMessage },
        { headers: { Authorization: `${token}` } }
      );
      setAlert({
        type: 'success',
        message: 'Request updated successfully.',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message,
      });
    }
  };

  if (!request) {
    return (
      <div className="flex w-52 flex-col gap-4 container mx-auto px-4 py-8">
        {/* Skeleton loaders */}
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-6 w-30"></div>
        {/* Additional skeleton elements */}
      </div>
    );
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
            <textarea
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              className="textarea text-white textarea-bordered bg-orange-600 focus:outline-none"
              placeholder="Enter your review message"
            />
          </div>
          <div className="form-control">
            <label className="label">Request Status</label>
            <select
              className="select select-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="APPROVED">Approved</option>
              <option value="DENIED">Denied</option>
              <option value="PENDING">Pending</option>
              <option value="RESUBMIT_REQUIRED">Resubmit Required</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">Your Username</label>
            <input type="text" value={request.username} readOnly className="input input-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
          </div>
          <div className="form-control">
            <label className="label">Request / Evidence</label>
            <input type="text" value={request.messageLink} readOnly className="input input-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
          </div>
          <div className="form-control">
            <label className="label">Additional Information</label>
            <textarea value={request.additionalInfo} readOnly className="textarea textarea-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
          </div>
          <div className="form-control mt-4">
            <button onClick={handleUpdateRequest} className="btn btn-primary">
              Update Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetail;
