
import React from 'react';
import { QuizChartData } from '../utils/prepareChartData';

interface CenterDisplayProps {
  chartData: QuizChartData[];
}

const CenterDisplay: React.FC<CenterDisplayProps> = ({ chartData }) => {
  const totalQuizTaken = chartData.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="text-3xl font-bold text-gray-800">{totalQuizTaken}</div>
      <div className="text-xs text-gray-500">Quiz réalisés</div>
    </div>
  );
};

export default CenterDisplay;
