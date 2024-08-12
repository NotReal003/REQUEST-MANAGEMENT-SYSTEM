import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { TbMessageReport } from "react-icons/tb";
import { FaCheckCircle, FaTimesCircle, FaRedoAlt } from 'react-icons/fa';

const One = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('https://api.notreal003.xyz/requests', {
          headers: {
            'Authorization': `${token}`,
          },
        });
        const data = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch requests. Please try again later.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestClick = (request) => {
    navigate(`/request/${request._id}`, { state: { request } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <button className="btn loading">Loading...</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className={`p-4 rounded-lg shadow-lg cursor-pointer flex justify-between items-center ${
              request.status === 'Approved' ? 'bg-green-500' : request.status === 'Denied' ? 'bg-red-500' : 'bg-orange-500'
            }`}
            onClick={() => handleRequestClick(request)}
          >
            <div className="flex items-center">
              {request.type === 'Discord' ? <TbMessageReport className="text-white mr-4" size={28} /> : <IoSend className="text-white mr-4" size={28} />}
              <div>
                <h2 className="text-white text-lg">{request.type} Report</h2>
                <p className="text-white">{new Date(request.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div>
              {request.status === 'Approved' ? (
                <FaCheckCircle className="text-white" size={24} />
              ) : request.status === 'Denied' ? (
                <FaTimesCircle className="text-white" size={24} />
              ) : (
                <FaRedoAlt className="text-white" size={24} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default One;
