
import { useContext } from 'react';
import QuizContext from '../context/QuizContext';

// Hook to use the Quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
