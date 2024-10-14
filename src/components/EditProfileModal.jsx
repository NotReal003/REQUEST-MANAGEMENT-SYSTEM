import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner, FaSave } from 'react-icons/fa';

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
      <Toaster />
      <div className="modal-box shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Display Name</h2>
        <input
          type="text"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-2 gap-x-2">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                Save <FaSpinner className="animate-spin mr-2" />
              </>
            ) : (
              <>
                Save <FaSave className="inline-block align-middle mr-2" />
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  ) : null;
};

export default EditProfileModal;
