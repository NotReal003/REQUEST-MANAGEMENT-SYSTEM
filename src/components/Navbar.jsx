import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { ImExit, ImSpinner6 } from "react-icons/im";
import { MdNavigateNext } from "react-icons/md";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { FcSettings } from "react-icons/fc";

export default function Navbar({ isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [errorIssue, setErrorIssue] = useState('');
  const API = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('jwtToken');
        const res = await fetch(`${API}/users/@me`, {
          headers: {
            'Authorization': `${token}`
          }
        });

        if (res.status === 403) {
          localStorage.removeItem('jwtToken');
          window.location.href = '/';
        }
        if (res.status === 0) {
         setShowAlert(true);
         setErrorIssue('Network Connection Error');
        }
        const data = await res.json();

        if (!res.ok) {
          setShowAlert(true);
          setErrorIssue(data.message || 'Network Connection Error');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        if (error.code === 'ERR_NETWORK');
        setShowAlert(true);
        setErrorIssue('Network Connection Error');
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
      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorIssue(data.message || 'Sorry, we are unable to logout you at the moment.');
        throw new Error('Failed to logout');
      }

      localStorage.removeItem('jwtToken');
      window.location.href = '/';
    } catch (error) {
      setShowAlert(true);
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
          <span>We are unable to verify you. Please check your network connection and reload this page. <strong>Error: {errorIssue}</strong></span>
          <div>
            <button className="btn btn-sm btn-outline btn-warning" onClick={() => window.location.reload()}>Reload</button>
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
              <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1 btn-sm">
                  Display
                  <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Auto"
                      value="default" />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Dracula"
                      value="dracula" />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Aqua"
                      value="aqua" />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Night"
                      value="night" />
                  </li>
                </ul>
              </div>
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
                  <ImSpinner6 className="animate-spin h-4 w-4"/>
                </div>
              ) : (
                <div className="dropdown dropdown-bottom dropdown-end mr-4 ml-2">
                  <button tabIndex={0} role="button" className="flex items-center justify-center">
                    {user && user.avatarHash ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}.webp?size=128`}
                        className="size-6 object-cover rounded-full border-blue-500"
                      />
                    ) : (
                      <FaUserCircle className="size-6" />
                    )}
                  </button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                    {isAuthenticated ? (
                      <li>
                        <Link to="/profile" className="flex items-center gap-x-3">
                          <FcSettings /> Profile
                        </Link>
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
