
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackNavigation = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2 mb-6">
      <button 
        onClick={() => navigate('/results')} 
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Retour aux résultats</span>
      </button>
    </div>
  );
};

export default BackNavigation;
