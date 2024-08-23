import React, { useEffect, useState } from 'react';
import { MdDelete, MdUpdate, MdEmail } from 'react-icons/md';
import axios from 'axios';

function RequestDetailModal({ requestId, onClose, refreshRequests }) {
  const [request, setRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const [status, setStatus] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`https://api.notreal003.xyz/admin/requests/${requestId}`, {
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

  const handleUpdateAndSendEmail = async () => {
    try {
      const token = localStorage.getItem('jwtToken');

      // Update the request status and review message
      const updateResponse = await axios.put(
        `https://api.notreal003.xyz/admin/${requestId}`,
        { status, reviewMessage },
        { headers: { Authorization: `${token}` } }
      );

      if (updateResponse.status === 200) {
        setAlert({
          type: 'success',
          message: updateResponse.data.message || 'Request updated successfully.',
        });

        // Send the email notification
        const emailResponse = await axios.post(
          'https://api.notreal003.xyz/admin/send/email',
          {
            requestId,
            reviewMessage,
            status,
            username: request.username,
            requestType: request.type,
            email: request.email,
          },
          { headers: { Authorization: `${token}` } }
        );

        if (emailResponse.status === 200) {
          setAlert({
            type: 'success',
            message: 'Email notification sent successfully.',
          });
        } else {
          setAlert({
            type: 'warning',
            message: 'Failed to send email notification.',
          });
        }
      } else {
        setAlert({
          type: 'warning',
          message: updateResponse.data.message || 'Request was updated but something might have gone wrong.',
        });
      }

      // Refresh the request list after update
      refreshRequests();
    } catch (error) {
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
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`https://api.notreal003.xyz/admin/${requestId}`, {
        headers: { Authorization: `${token}` },
      });
      setAlert({ type: 'success', message: 'Request deleted successfully.' });
      refreshRequests(); // Refresh the request list after deletion
      onClose(); // Close the modal
    } catch (error) {
      setAlert({ type: 'error', message: 'Error deleting request.' });
    }
    setShowDeleteModal(false);
  };

  if (!request) {
    return (
      <div className="flex w-52 flex-col gap-4 container mx-auto px-4 py-8">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-6 w-30"></div>
      </div>
    );
  }

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-5xl">
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
                <label className="label">Request User Username</label>
                <input
                  type="text"
                  value={request.username}
                  readOnly
                  className="input input-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="form-control">
                <label className="label">{request.type} Request</label>
                <input
                  type="text"
                  value={request.messageLink}
                  readOnly
                  className="input input-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="form-control">
                <label className="label">Additional Information</label>
                <textarea
                  value={request.additionalInfo}
                  readOnly
                  className="textarea textarea-bordered focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="form-control mt-4">
                <button onClick={handleUpdateAndSendEmail} className="btn btn-info">
                  <MdUpdate /> Update Request & Send Email
                </button>
              </div>
              <div className="form-control mt-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn btn-error"
                >
                  <MdDelete /> Delete Request
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="btn btn-info btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p>Are you sure you want to delete this request? This action cannot be undone.</p>
            <div className="modal-action">
              <button onClick={handleDelete} className="btn btn-error">
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RequestDetailModal;
