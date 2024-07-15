// src/pages/ReportForm.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ReportForm = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="form-container">
        <h1 className="text-2xl font-bold mb-4">Discord Report</h1>
        <div className="alert alert-info">
          <strong>Look!</strong> If you believe the user is violating the Discord Terms of Service or Community Guidelines, right-click the message and choose "Report message" button.
        </div>
        <form id="reportForm">
          <label htmlFor="messageLink" className="label">Discord Message Link (required)</label>
          <input type="text" id="messageLink" name="messageLink" className="input input-bordered w-full" placeholder="https://discord.com/channels/XXXXX/XXXXX/XXXXX" required />

          <label htmlFor="additionalInfo" className="label">Anything else you would like to add?</label>
          <textarea id="additionalInfo" name="additionalInfo" className="textarea textarea-bordered w-full" rows="4"></textarea>

          <div className="terms my-4">
            <label className="label cursor-pointer">
              <input type="checkbox" id="agree" name="agree" className="checkbox" required />
              <span className="label-text ml-2"> By clicking here you are allowing us to view the info added to the form by you. Please check out our SkyLine <a href="#" className="link link-primary">Terms of Service</a> and <a href="#" className="link link-primary">Privacy Policy</a>.</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full">Submit</button>
          <Link to="/" className="btn btn-secondary w-full mt-4">Back</Link>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
