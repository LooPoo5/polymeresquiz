
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
  // Calculate progress percentage based on answered questions
  const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);
  
  return (
    <div className="sticky top-16 z-30 py-3 bg-white border-b border-gray-200 mb-5 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          Questions répondues: {currentQuestion} sur {totalQuestions}
        </span>
        <span className="text-sm font-medium text-brand-red">
          {progressPercentage}%
        </span>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2.5 bg-gray-100"
      />
    </div>
  );
};

export default QuizProgressBar;
