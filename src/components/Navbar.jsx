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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('jwtToken');
        const res = await fetch('https://api.notreal003.xyz/users/@me', {
          headers: {
            'Authorization': `${token}`
          }
        });

        if (res.status === 403) {
          localStorage.removeItem('jwtToken');
          window.location.href = '/';
          setShowAlert(true);
        }

        if (!res.ok) {
          throw new Error('Not authenticated');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      setLoading(false);
    }
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
        <div role="alert" className="alert">
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
          <span>Your access has been denied, please Login again.</span>
          <div>
            <button className="btn btn-sm btn-outline mr-1 ml-1" onClick={() => setShowAlert(false)}>No</button>
            <button className="btn btn-sm btn-outline btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}

      <nav className="z-20 mb-5">
        <div className="container"></div>

        <div className="drawer drawer-end">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            <div className="w-full navbar bg-base-300">
              <Link to="/" className="font-bold text-lg flex-1 px-2 mx-2">
                NotReal003
              </Link>
              <label className="swap swap-rotate">
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" className="theme-controller" value="dracula" />

                {/* sun icon */}
                <svg
                  className="swap-off h-6 w-6 fill-current mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24">
                  <path
                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>

                {/* moon icon */}
                <svg
                  className="swap-on h-6 w-6 fill-current mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24">
                  <path
                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
              </label>
              <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1 btn-sm flex items-center justify-center"><MdNavigateNext />Requests</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><Link to="https://notreal003.xyz">Home <LiaExternalLinkAltSolid /></Link></li>
                  <li><Link to="/support">Support</Link></li>
                  <li><Link to="/Report">Discord Report</Link></li>
                  <li><Link to="/apply">Guild Application</Link></li>
                </ul>
              </div>

              {loading ? (
                <div className="flex items-center mr-4">
                  <span className="skeleton h-8 w-8 shrink-0 rounded-full"></span>
                </div>
              ) : (
                <div className="dropdown dropdown-bottom dropdown-end mr-4 ml-2">
                  <button tabIndex={0} role="button" className="flex items-center justify-center">
                    {user && user.avatarHash ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}.webp?size=128`}
                        className="size-6 object-cover rounded-full border"
                      />
                    ) : (
                      <FaUserCircle className="size-6" />
                    )}
                  </button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                    {isAuthenticated ? (
                      <li>
                        <Link onClick={handleLogout} className="flex items-center gap-x-3 hover:text-red-500">
                          <ImExit className="size-3" /> <span>Sign out</span>
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="https://api.notreal003.xyz/auth/signin" className="flex items-center gap-x-2 hover:text-blue-500">
                          <IoLogIn className="size-4" /> <span>Sign in</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
