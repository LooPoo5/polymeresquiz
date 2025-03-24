
import { useState } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';

const useQuizAnswers = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string, string>>({});
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);

  const handleAnswerSelect = (questionId: string, answerId: string, selected: boolean) => {
    if (!hasStartedQuiz) {
      setHasStartedQuiz(true);
    }
    
    setSelectedAnswers(prev => {
      const current = prev[questionId] || [];
      
      // For multiple-choice or satisfaction questions
      if (selected) {
        return {
          ...prev,
          [questionId]: [answerId]
        };
      } else {
        // For checkbox questions or deselection
        return {
          ...prev,
          [questionId]: current.filter(id => id !== answerId)
        };
      }
    });
  };

  const handleOpenEndedAnswerChange = (questionId: string, answer: string) => {
    if (!hasStartedQuiz && answer.trim()) {
      setHasStartedQuiz(true);
    }
    setOpenEndedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  return {
    selectedAnswers,
    openEndedAnswers,
    hasStartedQuiz,
    handleAnswerSelect,
    handleOpenEndedAnswerChange
  };
};

export default useQuizAnswers;
