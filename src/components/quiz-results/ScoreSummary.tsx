
import React from 'react';

interface ScoreSummaryProps {
  scoreOn20: number;
  successRate: number;
  durationInSeconds: number;
  totalPoints: number;
  maxPoints: number;
}

const ScoreSummary = ({ 
  scoreOn20, 
  successRate, 
  durationInSeconds, 
  totalPoints, 
  maxPoints 
}: ScoreSummaryProps) => {
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-brand-red mb-2 flex items-center">
          {Math.floor(scoreOn20)}/20
        </div>
        <div className="text-gray-500 text-center">Note finale</div>
      </div>
      
      <div className="border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-gray-800 mb-2">{Math.floor(successRate)}%</div>
        <div className="text-gray-500 text-center">Taux de réussite</div>
      </div>
      
      <div className="border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
          {formatDuration(durationInSeconds)}
        </div>
        <div className="text-gray-500 text-center">Temps total</div>
      </div>
      
      <div className="border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {totalPoints}/{maxPoints}
        </div>
        <div className="text-gray-500 text-center">Points obtenus</div>
      </div>
    </div>
  );
};

export default ScoreSummary;
