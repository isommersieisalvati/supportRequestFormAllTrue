import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import "./Confirmation.css";
import { useNavigate } from "react-router-dom";

const Confirmation: React.FC = () => {
  const formData = useSelector((state: RootState) => state.form.data);
  const navigate = useNavigate();
  const handleFillAnotherRequest = () => {
    navigate("/");
  };

  if (!formData) return <div>No data submitted.</div>;

  return (
    <div className="confirmation">
      <div className="confirmation-tick">&#9989;</div>
      <h2 className="confirmation-title">
        Your request has been sent and we will get back to you shortly.
      </h2>
      <div className="confirmation-message">
        <p className="confirmation-subtitle">Your submitted data:</p>
        <ul>
          <li className="full-name">Full Name: {formData.fullName}</li>
          <li className="email">Email: {formData.email}</li>
          <li className="issue-type">Issue Type: {formData.issueType}</li>
          <li className="tags">Tags: {formData.tags.join(", ")}</li>
          <li className="reproduce-steps">
            <p>Reproduce Steps:</p>
            {formData.reproduceSteps.map((step, index) => (
              <div key={index} className="reproduce-step">
                {step.step}
              </div>
            ))}
          </li>
        </ul>
      </div>
      <div className="confirmation-fill">
        <button
          className="confirmation-button"
          onClick={handleFillAnotherRequest}
        >
          Fill Another Request
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
