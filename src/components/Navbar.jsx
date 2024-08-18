import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { MdNavigateNext } from "react-icons/md";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

export default function Navbar({ isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // To track network status

  useEffect(() => {
    const handleNetworkChange = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        setShowAlert(true);
      }
    };

    // Listen for network changes
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    const fetchUserData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('jwtToken');
        const res = await fetch('https://api.notreal003.xyz/users/@me', {
          headers: {
            'Authorization': `${token}`
          }
        });

        if (!navigator.onLine || res.status === 0) {
          setShowAlert(true);
        }

        if (res.status === 403) {
          localStorage.removeItem('jwtToken');
          window.location.href = '/';
        }

        if (!res.ok) {
          throw new Error('Not authenticated');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.log(error);
        setShowAlert(true);
      }

      setLoading(false);
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const res = await fetch('https://api.notreal003.xyz/auth/signout', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to logout');
      }

      localStorage.removeItem('jwtToken');
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showAlert && (
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info h-6 w-6 shrink-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{isOnline ? 'We are unable to verify you, please check your internet connection.' : 'You are currently offline. Please check your connection.'}</span>
          <div>
            <button className="btn btn-lg btn-outline btn-secondary" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      )}

      <nav className="z-20 mb-5">
        {/* Navbar content */}
      </nav>
    </>
  );
}


window.location.href = '/';