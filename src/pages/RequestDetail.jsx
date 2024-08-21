import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowRoundBack } from 'react-icons/io';

function RequestDetail() {
  const { requestIds } = useParams();
  const [request, setRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const reviewMessageRef = useRef(null);
  const additionalInfoRef = useRef(null);
  const messageLinkRef = useRef(null);

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
          message: 'You do not have permission to check this request.',
        });
      });
  }, [requestId]);

  useEffect(() => {
    // Adjust height for textareas
    if (reviewMessageRef.current) {
      reviewMessageRef.current.style.height = 'auto';
      reviewMessageRef.current.style.height = `${reviewMessageRef.current.scrollHeight}px`;
    }
    if (additionalInfoRef.current) {
      additionalInfoRef.current.style.height = 'auto';
      additionalInfoRef.current.style.height = `${additionalInfoRef.current.scrollHeight}px`;
    }
    if (messageLinkRef.current) {
      messageLinkRef.current.style.height = 'auto';
      messageLinkRef.current.style.height = `${messageLinkRef.current.scrollHeight}px`;
    }
  }, [request]);

  const handleCancelRequest = async () => {
    try {
      const requestId = urlParams.get('id');
      const token = localStorage.getItem('jwtToken');
      await axios.put(`https://api.notreal003.xyz/requests/${requestId}/cancel`, {
        status: 'CANCELLED',
        reviewMessage: 'Self canceled by the user.',
      }, {
        headers: { Authorization: `${token}` },
      });

      setAlert({ type: 'success', message: 'Request canceled successfully.' });
      setRequest(prevState => ({ ...prevState, status: 'canceled', reviewMessage: 'Self canceled by the user.' }));
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to cancel the request. Please try again later.' });
    }
  };

  if (!request) {
    return <div className="flex w-52 flex-col gap-4 container mx-auto px-4 py-8">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
      <div className="skeleton h-6 w-30"></div>
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
          <h2 className="card-title">Request Details ({request.status})</h2>
          <div className="form-control">
            <label className="label">Review Message</label>
            <textarea
              ref={reviewMessageRef}
              value={request.reviewMessage || "This request hasn't been reviewed yet."}
              readOnly
              className="textarea text-white textarea-bordered bg-orange-600 focus:outline-none"
            />
          </div>
          <div className="form-control">
            <label className="label">Your Username</label>
            <input
              type="text"
              value={request.username}
              readOnly
              className="input input-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="form-control">
            <label className="label">{request.type} Request</label>
            <textarea
              ref={messageLinkRef}
              value={request.messageLink}
              readOnly
              className="textarea textarea-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="form-control">
            <label className="label">Anything else you would like to add?</label>
            <textarea
              ref={additionalInfoRef}
              value={request.additionalInfo}
              readOnly
              className="textarea textarea-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {request.reviewed && (
            <div className="mt-4">
              <button className="btn btn-outline btn-error w-full btn-sm" onClick={handleCancelRequest}>
                Cancel Request
              </button>
              <p className="text-center mt-2 text-xs">Something is wrong?</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <button className="btn btn-info btn-outline" onClick={() => navigate(-1)}>
          <IoMdArrowRoundBack /> Back
        </button>
      </div>
    </div>
  );
}

export default RequestDetail;
