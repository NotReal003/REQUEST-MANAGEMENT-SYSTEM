// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
  <div className="flex-1">
    <Link className="btn btn-ghost text-xl" to="/">NotReal003</Link>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1 ml-2">
      <li>
        <Link to="https://notreal003.xyz">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </Link>
      </li>
      <li>
        <details>
          <summary>Requests</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li><Link to="/apply">Apply</Link></li>
            <li><Link to="/report">/Report</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>
  );
};

export default Navbar;
