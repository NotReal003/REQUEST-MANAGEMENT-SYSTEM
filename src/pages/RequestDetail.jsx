import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [messageLink, setMessageLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch the specific request details using the ID
    const fetchRequest = async () => {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`https://api.notreal003.xyz/requests/${id}`, {
        headers: { Authorization: `${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRequest(data);
        setMessageLink(data.messageLink);
        setAdditionalInfo(data.additionalInfo);
      }
    };

    fetchRequest();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setStatus('You must be logged in to submit a request.');
      return;
    }

    const payload = {
      messageLink,
      additionalInfo,
    };

    try {
      const response = await fetch(`https://api.notreal003.xyz/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('Request updated successfully');
        navigate('/requests');
      } else {
        setStatus('Error updating the request');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error while updating the request');
    }
  };

  if (!request) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="form-container">
        <h1 className="text-2xl font-bold mb-4">Edit Request</h1>
        {status && <div className="alert alert-warning">{status}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="messageLink" className="label">Discord Message Link</label>
          <input
            type="text"
            id="messageLink"
            className="input input-bordered w-full"
            value={messageLink}
            onChange={(e) => setMessageLink(e.target.value)}
            required
          />

          <label htmlFor="additionalInfo" className="label">Additional Information</label>
          <textarea
            id="additionalInfo"
            className="textarea textarea-bordered w-full"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>

          <button type="submit" className="btn btn-primary w-full mt-4">Update</button>
        </form>
      </div>
    </div>
  );
};

export default RequestDetail;
