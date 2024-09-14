import React, { useState, useEffect, useCallback } from 'react';
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
  const API = process.env.REACT_APP_API;

  // Fetch blocked and non-blocked users from the API
  const fetchBlockedUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/users/blocks`, {
        headers: {
          Authorization: `${localStorage.getItem('jwtToken')}`,
        },
      });

      // Separate users based on their "blocked" status
      const blocked = response.data.filter(user => user.blocked === "YES");
      const nonBlocked = response.data.filter(user => user.blocked !== "YES");

      setBlockedUsers(blocked);
      setNonBlockedUsers(nonBlocked);
    } catch (error) {
      const errorStatus = error.response?.status;
      if (errorStatus === 403) {
        // Navigate to the 404 page if forbidden
        navigate('/PageNotFound');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to load users. Please try again later.';
        console.error('Error fetching blocked users:', error);
        setError(`${errorStatus}: ${errorMessage || 'Failed to fetch users. Please try again.'}`);
      }
    }
  }, [API, navigate]);


  // Fetch all blocked users when the component mounts
  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  // Block user function
  const blockUser = async () => {
    const blockUserPromise = axios.post(
      `${API}/users/block/add`,
      { myBlockUser, myBlockReason },
      {
        headers: {
          Authorization: `${localStorage.getItem('jwtToken')}`,
        },
      }
    );

    toast.promise(
      blockUserPromise,
      {
        pending: 'Blocking user...',
        success: 'User blocked successfully!',
        error: {
          render({ data }) {
            return data.response?.data?.message || 'An error occurred while blocking the user.';
          },
        },
      }
    );

    try {
      await blockUserPromise;
      fetchBlockedUsers(); // Refresh the list after blocking a user
    } catch (error) {
      console.error('Error blocking the user:', error);
    }
  };

  // Unblock user function
  const unblockUser = async (userId) => {
    const unblockUserPromise = axios.put(
      `${API}/users/unblock`,
      { myBlockUser: userId },
      {
        headers: {
          Authorization: `${localStorage.getItem('jwtToken')}`,
        },
      }
    );
    setMessage(null);

    toast.promise(
      unblockUserPromise,
      {
        pending: 'Unblocking user...',
        success: 'User unblocked successfully!',
        error: {
          render({ data }) {
            return data.response?.data?.message || 'An error occurred while unblocking the user.';
          },
        },
      }
    );

    try {
      await unblockUserPromise;
      fetchBlockedUsers(); // Refresh the list after unblocking a user
    } catch (error) {
      console.error('Error unblocking the user:', error);
    }
  };

  if (!blockedUsers) {
    return <div>Loading...</div>;
  }

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
