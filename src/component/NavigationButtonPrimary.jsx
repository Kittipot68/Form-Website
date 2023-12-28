// import React from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function NavigationButtonPrimary({ destination, buttonText }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(destination);
  };

  return (
    <button
      className="btn btn-primary" // Replace Tailwind classes with Bootstrap classes
      onClick={handleButtonClick}
    >
      {buttonText}
    </button>
  );
}

export default NavigationButtonPrimary;
