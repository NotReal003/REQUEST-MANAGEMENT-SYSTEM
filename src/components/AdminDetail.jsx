import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { MdDelete, MdUpdate, MdEmail } from 'react-icons/md';

const AdminDetail = ({ requestId, onBack }) => {
  const [request, setRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const [status, setStatus] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const API = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${API}/admin/requests/${requestId}`, {
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
        `${API}/admin/requests/${requestId}`,
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
          `${API}/admin/send/email`,
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
      await axios.delete(`${API}/admin/requests/${requestId}`, {
        headers: { Authorization: `${token}` },
      });
      setAlert({
        type: 'success',
        message: 'Request deleted successfully.',
      });
      onBack(); // Go back to the admin dashboard after deletion
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error while deleting the request.',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button className="btn btn-info mb-4" onClick={onBack}>
        <IoMdArrowRoundBack className="mr-2" />
        Back
      </button>

      {alert && (
        <div
          className={`alert ${alert.type === 'error' ? 'alert-error' : alert.type === 'success' ? 'alert-success' : 'alert-warning'} shadow-lg mb-4`}
        >
          <span>{alert.message}</span>
        </div>
      )}

      {request ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Request Details</h2>
          <div className="p-4 bg-gray-700 rounded-lg shadow-lg">
            <p className="mb-2">
              <strong>Username:</strong> {request.username}
            </p>
            <p className="mb-2">
              <strong>Request Type:</strong> {request.type}
            </p>
            <p className="mb-2">
              <strong>Message Link:</strong>{' '}
              <a href={request.messageLink} target="_blank" rel="noopener noreferrer">
                {request.messageLink}
              </a>
            </p>
            <p className="mb-4">
              <strong>Status:</strong> {request.status}
            </p>
            <label className="block mb-2">Update Status:</label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="DENIED">Denied</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <textarea
              className="textarea textarea-bordered w-full mt-4"
              placeholder="Add review message (optional)"
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
            ></textarea>
            <div className="flex mt-4 gap-2">
              <button className="btn btn-info" onClick={handleUpdateAndSendEmail}>
                <MdUpdate className="mr-2" />
                Update & Send Email
              </button>
              <button className="btn btn-error btn-outline" onClick={() => setShowDeleteModal(true)}>
                <MdDelete className="mr-2" />
                Delete Request
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-800">Loading request details...</p>
      )}

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete this request?</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button
                className="btn btn-info btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetail;