
import React from 'react';
import { Medal, Percent, Clock, Award } from 'lucide-react';

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

  const scoreCards = [
    {
      icon: <Medal size={20} className="text-brand-red" />,
      value: `${Math.floor(scoreOn20)}/20`,
      label: "Note finale",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      textColor: "text-brand-red",
      valueSize: "text-3xl"
    },
    {
      icon: <Percent size={20} className="text-gray-700 dark:text-gray-300" />,
      value: `${Math.floor(successRate)}%`,
      label: "Taux de réussite",
      bgColor: "bg-gray-50 dark:bg-gray-800/50",
      textColor: "text-gray-800 dark:text-gray-200",
      valueSize: "text-3xl"
    },
    {
      icon: <Clock size={20} className="text-gray-700 dark:text-gray-300" />,
      value: formatDuration(durationInSeconds),
      label: "Temps total",
      bgColor: "bg-gray-50 dark:bg-gray-800/50",
      textColor: "text-gray-800 dark:text-gray-200",
      valueSize: "text-2xl"
    },
    {
      icon: <Award size={20} className="text-gray-700 dark:text-gray-300" />,
      value: `${totalPoints}/${maxPoints}`,
      label: "Points obtenus",
      bgColor: "bg-gray-50 dark:bg-gray-800/50",
      textColor: "text-gray-800 dark:text-gray-200",
      valueSize: "text-3xl"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {scoreCards.map((card, index) => (
        <div 
          key={index} 
          className={`${card.bgColor} rounded-xl p-6 flex flex-col items-center justify-center shadow-sm`}
        >
          <div className="mb-1">{card.icon}</div>
          <div className={`${card.valueSize} font-bold ${card.textColor} mb-1`}>
            {card.value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreSummary;
