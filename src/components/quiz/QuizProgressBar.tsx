
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuizProgressBar: React.FC<QuizProgressBarProps> = ({ 
  currentQuestion, 
  totalQuestions 
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);
  
  return (
    <div className="sticky top-16 z-30 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Question {currentQuestion} sur {totalQuestions}
        </span>
        <span className="text-sm font-medium text-brand-red dark:text-red-400">
          {progressPercentage}%
        </span>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2 bg-gray-200 dark:bg-gray-700"
      />
    </div>
  );
};

export default QuizProgressBar;
