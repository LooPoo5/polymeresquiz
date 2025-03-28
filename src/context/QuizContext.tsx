
import React, { createContext, useContext, useState } from 'react';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import { QuizContextType } from './types';
import { createQuiz, updateQuiz, deleteQuiz, getQuiz } from './quizOperations';
import { addResult, getResult, getQuizResults, deleteResult } from './resultOperations';

// Re-export types from types.ts
export type { Answer, Question, Quiz, Participant, QuizResult } from './types';

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

// Provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { quizzes, setQuizzes, results, setResults, loadData } = useQuizStorage();

  const contextValue: QuizContextType = {
    quizzes,
    results,
    createQuiz: (quizData) => createQuiz(quizData, quizzes, setQuizzes),
    updateQuiz: (quiz) => updateQuiz(quiz, quizzes, setQuizzes),
    deleteQuiz: (id) => deleteQuiz(id, quizzes, setQuizzes, results, setResults),
    getQuiz: (id) => getQuiz(id, quizzes),
    addResult: (result) => addResult(result, results, setResults),
    getResult: (id) => getResult(id, results),
    getQuizResults: (quizId) => getQuizResults(quizId, results),
    deleteResult: (id) => deleteResult(id, results, setResults),
    refreshData: () => loadData(), // Implement the refreshData method
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};
