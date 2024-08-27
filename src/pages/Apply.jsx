import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { FaPeopleGroup } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Apply = () => {
  const [inGameName, setInGameName] = useState('');
  const [messageLink, setMessageLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.warning('You must be logged in to submit an application.');
      setIsLoading(false);
      return;
    }

    const payload = {
      inGameName,
      messageLink,
      additionalInfo,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      toast.error('Our server is not responding please try again later.');
      setIsLoading(false);
    }, 5000);

    try {
      const response = await fetch('https://api.notreal003.xyz/requests/guild', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'There was an issue submitting your application. Please try again.');
        setIsLoading(false);
        return;
      }

      toast.success(data.message || 'Application submitted successfully.');
      setInGameName('');
      setMessageLink('');
      setAdditionalInfo('');
      setIsLoading(false);
      navigate(`/success?request=${data.requestId}`);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        toast.error('There was an error submitting your application. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="form-container">
        <h1 className="text-2xl font-bold mb-4 fill-current flex items-center justify-center">
          <FaPeopleGroup className="size-6 mr-2" /> Guild Application
        </h1>
        <form id="guildApplicationForm" onSubmit={handleSubmit}>
          <label htmlFor="inGameName" className="label">In-Game Name (required)</label>
          <input
            id="inGameName"
            name="inGameName"
            className="input input-bordered w-full"
            type="text"
            placeholder="Enter your in-game name"
            value={inGameName}
            onChange={(e) => setInGameName(e.target.value)}
            required
          />

          <label htmlFor="messageLink" className="label">Reason for joining the guild? (required)</label>
          <textarea
            id="messageLink"
            name="messageLink"
            className="textarea textarea-bordered w-full"
            rows="3"
            placeholder="Let us know why you want to join"
            value={messageLink}
            onChange={(e) => setMessageLink(e.target.value)}
            required
          />

          <label htmlFor="additionalInfo" className="label">Anything else? (Optional)</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            className="textarea textarea-bordered w-full"
            rows="2"
            placeholder="Feel free to leave this field blank"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>

          <button 
            type="submit" 
            className={`btn btn-outline btn-primary w-full mt-4 ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : <><IoSend className="mr-2" />Submit</>}
          </button>
          <Link to="/" className="btn btn-outline btn-secondary w-full mt-4">
            <ImExit className="mr-2" />Back
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Apply;
