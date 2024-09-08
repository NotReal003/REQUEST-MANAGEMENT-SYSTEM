import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BlockUserPage = () => {
  const [myBlockUser, setMyBlockUser] = useState('');
  const [myBlockReason, setMyBlockReason] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [nonBlockedUsers, setNonBlockedUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all blocked users when the component mounts
  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // Fetch blocked and non-blocked users from the API
  const fetchBlockedUsers = async () => {
    try {
      const response = await axios.get('/api/users/blocks', {
        headers: {
          Authorization: `${localStorage.getItem('jwtToken')}`,
        },
      });

      if (response.status === 403) {
        navigate('/404'); // Navigate to 404 if forbidden
      }

      // Separate users based on their "blocked" status
      const blocked = response.data.filter(user => user.blocked === "YES");
      const nonBlocked = response.data.filter(user => user.blocked !== "YES");

      setBlockedUsers(blocked);
      setNonBlockedUsers(nonBlocked);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setError(error.message || 'Failed to fetch users. Please try again.');
    }
  };

  // Block user function
  const blockUser = async () => {
    try {
      const response = await axios.post(
        '/api/users/block/add',
        { myBlockUser, myBlockReason },
        {
          headers: {
            Authorization: `${localStorage.getItem('jwtToken')}`,
          },
        }
      );

  toast.promise(
    response,
    {
      pending: 'Cancelling your request...',
      success: 'Request cancelled successfully',
      error: {
        render({ data }) {
          // Use a custom error message if available
          return data.response?.data?.message || 'An error occurred while cancelling your request';
        },
      },
    }
  );

  try {
    await response;
  } catch (error) {
    // Handle any additional error logic if necessary
    console.error('Error cancelling the request:', error);
  }

  // Unblock user function
  const unblockUser = async (userId) => {
    try {
      const response = await axios.put(
        '/api/users/unblock',
        { myBlockUser: userId },
        {
          headers: {
            Authorization: `${localStorage.getItem('jwtToken')}`,
          },
        }
      );

      toast.promise(
        response,
        {
          pending: 'Cancelling your request...',
          success: 'Request cancelled successfully',
          error: {
            render({ data }) {
              // Use a custom error message if available
              return data.response?.data?.message || 'An error occurred while cancelling your request';
            },
          },
        }
      );

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
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

      {/* Non-blocked Users List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Non-blocked Users</h2>
        {nonBlockedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {nonBlockedUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>Not Blocked</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info shadow-lg">
            <span>No non-blocked users found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockUserPage;
