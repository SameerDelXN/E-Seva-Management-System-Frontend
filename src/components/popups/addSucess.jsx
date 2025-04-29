import React, { useEffect } from 'react';
import './SuccessPopup.css'; // Shared styles for all popups

const AddSuccessPopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-popup">
      <div className="popup-content">
        <div className="popup-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Data Added Successfully!</h3>
        <p>Your data has been successfully added <br/>to the system.</p>
        <button onClick={onClose} className="close-btn">OK</button>
      </div>
    </div>
  );
};

export default AddSuccessPopup;