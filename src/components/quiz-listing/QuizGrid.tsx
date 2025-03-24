
import React from 'react';
import { Quiz } from '@/types/quiz';
import QuizCard from '@/components/ui-components/QuizCard';

interface QuizGridProps {
  quizzes: Quiz[];
}

const QuizGrid: React.FC<QuizGridProps> = ({ quizzes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quizzes.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}
    </div>
  );
};

export default QuizGrid;
