import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { FaShieldHalved } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.warn('You must be logged in to submit a request.',
                 {
                    position: "top-center",
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: false,
                     draggable: true,
                     progress: undefined,
                     theme: "colored",
                     transition: "Slide",
                 });
      return;
    }

    const payload = {
      messageLink,
      additionalInfo,
      requestType: 'report',
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

      if (response.status === 403) {
        toast.error('Your access has been denied, please login again.',
                    {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: "Slide",
                    });
        return;
      }

      const requests = await response.json();

      if (response.ok) {
        toast.success('Your report was submitted successfully!',
                      {
                          position: "top-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: true,
                          progress: undefined,
                          theme: "colored",
                          transition: "Slide",
                      });
        setMessageLink('');
        setAdditionalInfo('');
        setAgree(false);
        navigate(`/success?request=${requests.requestId}`);
      } else {
        const errorData = await response.json();
        toast.error(`${errorData.message}`,
                    {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: "Slide",
                    });
      }
    } catch (error) {
      console.error('Error: ', error);
      toast.error('Hold on, there was an error while submitting your report :/');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="form-container">
        <h1 className="text-2xl font-bold mb-4 fill-current flex items-center justify-center">
          <FaShieldHalved className="size-6 mr-2" />Discord report
        </h1>
        <div role="alert" className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>If you believe the user is violating the Discord Terms of Service or Community Guidelines, right-click the message and choose "Report message" button.</span>
        </div>
        <form id="reportForm" onSubmit={handleSubmit}>
          <label htmlFor="messageLink" className="label">Discord Message Link / Evidence (required)</label>
          <input
            type="text"
            id="messageLink"
            name="messageLink"
            className="input input-bordered w-full"
            placeholder="https://discord.com/channels/XXXXX/XXXXX/XXXXX"
            value={messageLink}
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
              <span className="label-text ml-2"> By clicking here you are allowing us to view the info added to the form by you. Please check out our <a href="https://support.notreal003.xyz/terms" className="link link-primary">Terms of Service</a> and <a href="https://support.notreal003.xyz/terms" className="link link-primary">Privacy Policy</a>.</span>
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
