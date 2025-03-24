
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quiz, QuizResult, QuizContextType } from '@/types/quiz';
import { loadQuizzes, loadResults, saveQuizzes, saveResults } from '@/utils/quizStorage';

// Create the context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Custom hook to use the QuizContext
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

// Re-export types from the types file for backward compatibility
export type { Answer, Question, Quiz, Participant, QuizResult } from '@/types/quiz';

// Provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    setQuizzes(loadQuizzes());
    setResults(loadResults());
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveQuizzes(quizzes);
  }, [quizzes]);

  useEffect(() => {
    saveResults(results);
  }, [results]);

  const createQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date(),
    };
    setQuizzes([...quizzes, newQuiz]);
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
    setQuizzes(quizzes.map(quiz => quiz.id === updatedQuiz.id ? updatedQuiz : quiz));
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    // Also delete associated results
    setResults(results.filter(result => result.quizId !== id));
  };

  const getQuiz = (id: string) => {
    return quizzes.find(quiz => quiz.id === id);
  };

  const addResult = (result: Omit<QuizResult, 'id'>) => {
    const newResult: QuizResult = {
      ...result,
      id: `result-${Date.now()}`,
    };
    setResults([...results, newResult]);
    return newResult.id;
  };

  const getResult = (id: string) => {
    return results.find(result => result.id === id);
  };

  const getQuizResults = (quizId: string) => {
    return results.filter(result => result.quizId === quizId);
  };

  const deleteResult = (id: string) => {
    setResults(results.filter(result => result.id !== id));
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        results,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        getQuiz,
        addResult,
        getResult,
        getQuizResults,
        deleteResult
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
