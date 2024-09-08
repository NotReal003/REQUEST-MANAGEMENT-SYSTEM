import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlockUserPage = () => {
  const [myBlockUser, setMyBlockUser] = useState('');
  const [myBlockReason, setMyBlockReason] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all blocked users when the component mounts
  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // Fetch blocked users from the API
  const fetchBlockedUsers = async () => {
    try {
      const response = await axios.get('/blocks', {
        headers: {
          Authorization: `${localStorage.getItem('jwtToken')}`,
        },
      });
      setBlockedUsers(response.data);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setError('Failed to fetch blocked users. Please try again.');
    }
  };

  // Block user function
  const blockUser = async () => {
    try {
      const response = await axios.post(
        '/block/add',
        { myBlockUser, myBlockReason },
        {
          headers: {
            Authorization: `${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      setMessage(response.data.message);
      setError(null);
      fetchBlockedUsers(); // Refresh the blocked users list
    } catch (error) {
      console.error('Error blocking user:', error);
      setError(error.response.data.message || 'Failed to block user.');
      setMessage(null);
    }
  };

  // Unblock user function
  const unblockUser = async (userId) => {
    try {
      const response = await axios.put(
        '/unblock',
        { myBlockUser: userId },
        {
          headers: {
            Authorization: `${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      setMessage(response.data.message);
      setError(null);
      fetchBlockedUsers(); // Refresh the blocked users list
    } catch (error) {
      console.error('Error unblocking user:', error);
      setError(error.response.data.message || 'Failed to unblock user.');
      setMessage(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Block/Unblock Users</h1>

      {/* Block User Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Block a User</h2>
        <input
          type="text"
          placeholder="Enter user ID"
          value={myBlockUser}
          onChange={(e) => setMyBlockUser(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <input
          type="text"
          placeholder="Enter reason"
          value={myBlockReason}
          onChange={(e) => setMyBlockReason(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <button className="btn btn-primary" onClick={blockUser}>
          Block User
        </button>
      </div>

      {/* Display success or error message */}
      {message && (
        <div className="alert alert-success shadow-lg mb-4">
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Blocked Users List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Blocked Users</h2>
        {blockedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blockedUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.reason}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => unblockUser(user.user_id)}
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info shadow-lg">
            <span>No blocked users found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockUserPage;
