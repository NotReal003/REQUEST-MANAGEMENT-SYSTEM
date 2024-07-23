import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { MdNavigateNext } from "react-icons/md";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

export default function Navbar({ isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          nagivate('/login');
          throw new Error('Forbidden: Invalid or expired token');
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
                  <span className="loading loading-spinner size-6"></span>
                </div>
              ) : (
                <div className="dropdown dropdown-end mr-4 ml-2">
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
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    {isAuthenticated ? (
                      <li>
                        <a onClick={handleLogout} className="flex items-center gap-x-2 hover:text-red-500">
                          <ImExit className="size-4" /> <span>Sign out</span>
                        </a>
                      </li>
                    ) : (
                      <li>
                        <Link to="/login" className="flex items-center gap-x-2 hover:text-blue-500">
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
