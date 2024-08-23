import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaSpinner } from 'react-icons/fa';

function RequestDetail() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
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
      .then(response => {
        setRequest(response.data);
        setLoading(false);
      })
      .catch(() => {
        setAlert({
          type: 'error',
          message: 'You cannot view the request, either you do not have permission or given requestId is not vaild:',
        });
        setLoading(false);
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
      const urlParams = new URLSearchParams(window.location.search);
      const requestId = urlParams.get('id');
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put(
        `https://api.notreal003.xyz/requests/${requestId}/cancel`, {
        status: 'CANCELLED',
        reviewMessage: 'Self canceled by the user.',
      },
        { headers: { Authorization: `${token}` } }
      );

      if (response.status === 200) {
        setAlert({
          type: 'info',
          message: response.data.message || 'Request updated successfully.',
        });
      } else {
        setAlert({
          type: 'warning',
          message: response.data.message || 'Request was updated but something might have gone wrong.',
        });
      }
    } catch (error) {
      // If the API returns an error
      if (error.response) {
        setAlert({
          type: 'error',
          message: error.response.data.message || 'Error updating the request.',
        });
      } else {
        setAlert({
          type: 'error',
          message: 'An unknown error occurred while updating the request.',
        });
      }
    } finally {
      setShowCancelModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-52 flex-col gap-4 container mx-auto px-4 py-8">
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
  </div>
    );
  }
  if (!request) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p>{request.message}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && (
        <div className={`alert alert-${alert.type} shadow-lg mb-4 relative`}>
          <div>
            <span>{alert.message}</span>
          </div>
          <button
            className="absolute top-2 right-2 text-xl font-bold"
            onClick={() => setAlert(null)}
          >&times;</button>
        </div>
      )}
      {request.reviewed === 'false' && (
        <div className="flex items-center m-2">
          <p className="text-sm text-gray-400 m-2">Your request is currently being reviewed by the admin.</p>
        </div>
      )}
      <div className="card shadow-lg bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Request Details ({request.status})</h2>
          {request.reviewed === 'true' && (
            <div className="form-control">
              <label className="label">Review Message</label>
              <textarea
                ref={reviewMessageRef}
                value={request.reviewMessage || `Your request was ${request.status}.`}
                readOnly
                className="textarea text-white textarea-bordered bg-orange-500 focus:outline-none"
              />
            </div>
          )}
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

          {request.reviewed === 'false' && (
            <div className="mt-4">
              <p className="text-center mb-2 text-gray-400 text-xs">Something is wrong?</p>
              <button
                className="btn text-white bg-orange-500 hover:bg-orange-600 w-full btn-sm no-animation"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Request
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <button
          className="btn btn-info btn-outline transition-transform transform hover:scale-105"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack /> Back
        </button>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to cancel this request?</h3>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-outline"
                onClick={() => setShowCancelModal(false)}
              >
                No, keep it
              </button>
              <button
                className="btn bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleCancelRequest}
              >
                Yes, cancel it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestDetail;