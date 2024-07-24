import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { MdOutlineSecurity } from "react-icons/md";

const Support = () => {
  const [messageLink, setMessageLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setStatus('You must be logged in to submit a request.');
      return;
    }

    const payload = {
      messageLink,
      additionalInfo,
    };

    try {
      const response = await fetch('https://api.notreal003.xyz/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('Your request submitted successfully');
        setMessageLink('');
        setAdditionalInfo('');
        setAgree(false);
        navigate('/success');
      } else {
        setStatus('Please log in again, your access has been denied.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error while submitting report');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="form-container">
        <h1 className="text-2xl font-bold mb-4 fill-current flex items-center justify-center">
          <MdOutlineSecurity className="size-6 mr-2"/>Support
        </h1>
        {status && <div className="mt-4 alert alert-warning mb-4">{status}</div>}
        <div role="alert" className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Feel free ask anything!</span>
        </div>
        <form id="reportForm" onSubmit={handleSubmit}>
          <label htmlFor="messageLink" className="label">Your support request(required)</label>
          <textarea
            id="additionalInfo" 
            name="additionalInfo" 
            className="textarea textarea-bordered w-full" 
            rows="3" 
            placeholder="Let us know the issue"
            value={messageLink}
            onChange={(e) => setMessageLink(e.target.value)}
            required 
          />

          <label htmlFor="additionalInfo" className="label">Anything else?</label>
          <textarea 
            id="additionalInfo" 
            name="additionalInfo" 
            className="textarea textarea-bordered w-full" 
            rows="1" 
            placeholder="Feel free to leave this field blank"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>

          <div className="terms my-4">
            <label className="label cursor-pointer">
              <input 
                type="checkbox" 
                id="agree" 
                name="agree" 
                className="checkbox" 
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required 
              />
              <span className="label-text ml-2"> By clicking here you are allowing us to view the info added to the form by you. Please check out our SkyLine <a href="https://support.notreal003.xyz/privacy" className="link link-primary">Terms of Service</a> and <a href="https://support.notreal003.xyz/terms" className="link link-primary">Privacy Policy</a>.</span>
            </label>
          </div>

          <button type="submit" className="btn btn-outline btn-primary w-full"><IoSend />Submit</button>
          <Link to="/" className="btn btn-outline btn-secondary w-full mt-4"><ImExit />Back</Link>
        </form>
      </div>
    </div>
  );
};

export default Support;
