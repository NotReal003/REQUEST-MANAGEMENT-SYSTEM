import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const [status, setStatus] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get(`https://api.notreal003.xyz/admin/requests/${id}`, {
          headers: { Authorization: `${token}` },
        });
        setRequest(response.data);
        setStatus(response.data.status);
        setReviewMessage(response.data.reviewMessage || '');
      } catch (error) {
        setAlert({ type: 'error', message: 'Error fetching request.' });
      }
    };

    fetchRequest();
  }, [id]);

  const handleDeleteRequest = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.delete(`https://api.notreal003.xyz/admin/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setAlert({ type: 'success', message: 'Request deleted successfully.' });
      navigate('/admin');  // Redirect back to the admin dashboard
    } catch (error) {
      setAlert({ type: 'error', message: 'Error deleting request.' });
    }
  };

  const handleUpdateRequest = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.put(
        `https://api.notreal003.xyz/admin/${id}`,
        { status, reviewMessage },
        { headers: { Authorization: `${token}` } }
      );
      setAlert({ type: 'success', message: response.data.message });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error updating request.' });
    }
  };

  if (!request) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {alert && (
        <div className={`alert alert-${alert.type} shadow-lg mb-4`}>
          <div>{alert.message}</div>
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
              className="textarea textarea-bordered bg-orange-600 focus:outline-none"
            />
          </div>
          <div className="form-control">
            <label className="label">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input input-bordered focus:outline-none"
            />
          </div>
          <button className="btn btn-success mt-4" onClick={handleUpdateRequest}>
            Update Request
          </button>
          <button className="btn btn-error mt-4 ml-2" onClick={handleDeleteRequest}>
            Delete Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDetail;
