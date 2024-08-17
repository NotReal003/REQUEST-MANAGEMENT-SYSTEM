// src/components/EditProfileModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const eprofile = ({ isOpen, onClose, currentDisplayName, onUpdate }) => {
  const [newDisplayName, setNewDisplayName] = useState(currentDisplayName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put(
        'https://api.notreal003.xyz/users/display',
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
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
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Eprofile;
