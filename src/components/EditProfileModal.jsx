// src/components/EditProfileModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose, currentDisplayName, onUpdate }) => {
  const [newDisplayName, setNewDisplayName] = useState(currentDisplayName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API;

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put(
        `${API}/users/display`,
        { displayName: newDisplayName },
        { headers: { Authorization: `${token}` } }
      );

      if (response.status === 200) {
        onUpdate(newDisplayName);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update display name.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the display name.');
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-box shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Display Name</h2>
        <input
          type="text"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
  {loading ? (
    <FaSpinner className="animate-spin" />
  ) : (
    <>
      <svg width="40" height="40" viewBox="0 0 430 430" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M344.35 142.219L379.705 106.863L323.137 50.2949L287.781 85.6503" stroke="#08A88A" stroke-width="12" stroke-miterlimit="14" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M153.431 333.137L68.6216 361.465L96.8623 276.568" stroke="#121331" stroke-width="12" stroke-miterlimit="14" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M153.431 333.138L96.8624 276.569L287.781 85.6504L344.35 142.219L153.431 333.138Z" stroke="#121331" stroke-width="12" stroke-miterlimit="14" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M220.606 209.394L287.781 142.219" stroke="#08A88A" stroke-width="12" stroke-miterlimit="14" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Saving...
    </>
  )}
</button>

        </div>
      </div>
    </div>
  ) : null;
};

export default EditProfileModal;
