import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { TbMessageReport } from "react-icons/tb";


const ReportForm = () => {
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
      additionalInfo
    };

    try {
      const response = await fetch('https://api.notreal003.xyz/requests/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('Report submitted successfully');
        setMessageLink('');
        setAdditionalInfo('');
        setAgree(false);
        navigate('/success');
      } else {
        setStatus('Please Login again, your accses has been deneid.');
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
          <TbMessageReport className="size-6 mr-2"/>Discord report
        </h1>
        {status && <div className="mt-4 alert alert-error mb-4">{status}</div>}
        <div role="alert" className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>If you believe the user is violating the Discord Terms of Service or Community Guidelines, right-click the message and choose "Report message" button.</span>
        </div>
        <form id="reportForm" onSubmit={handleSubmit}>
          <label htmlFor="messageLink" className="label">Discord Message Link (required)</label>
          <input 
            type="text" 
            id="messageLink" 
            name="messageLink" 
            className="input input-bordered w-full" 
            placeholder="https://discord.com/channels/XXXXX/XXXXX/XXXXX" 
            value={messageLink}l
            onChange={(e) => setMessageLink(e.target.value)}
            required 
          />

          <label htmlFor="additionalInfo" className="label">Anything else you would like to add?</label>
          <textarea 
            id="additionalInfo" 
            name="additionalInfo" 
            className="textarea textarea-bordered w-full" 
            rows="4" 
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

export default ReportForm;
