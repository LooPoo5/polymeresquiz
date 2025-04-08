
import React from 'react';

const ResultsLoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
      <div className="animate-pulse text-center">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
        <div className="h-32 bg-gray-200 rounded w-full max-w-md mb-6 mx-auto"></div>
        <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>
    </div>
  );
};

export default ResultsLoadingState;
