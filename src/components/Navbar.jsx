// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">Example!!</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/support">Support</Link></li>
          <li><Link to="/apply">Apply</Link></li>
          <li><Link to="/report">Report</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
