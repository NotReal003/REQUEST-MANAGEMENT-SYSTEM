// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <Link to="https://notreal003.xyz/contact" className="link link-hover hover:underline">Contact Us</Link>
        <Link to="https://support.notreal003.xyz/privacy" className="link link-hover hover:underline">Privacy Policy</Link>
        <Link to="https://notreal003.xyz" className="link link-hover hover:underline">NotReal003</Link>
      </nav>
      <aside>
        <p>Copyright © 2024 NotReal003 - All rights reserved.</p>
      </aside>
    </footer>
  );
};

export default Footer;
