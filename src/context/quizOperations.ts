
import { Quiz } from './types';

export const createQuiz = (
  quizData: Omit<Quiz, 'id' | 'createdAt'>, 
  quizzes: Quiz[], 
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>
): void => {
  const newQuiz: Quiz = {
    ...quizData,
    id: `quiz-${Date.now()}`,
    createdAt: new Date(),
  };
  setQuizzes([...quizzes, newQuiz]);
};

export const updateQuiz = (
  updatedQuiz: Quiz, 
  quizzes: Quiz[], 
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>
): void => {
  setQuizzes(quizzes.map(quiz => quiz.id === updatedQuiz.id ? updatedQuiz : quiz));
};

export const deleteQuiz = (
  id: string, 
  quizzes: Quiz[], 
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>,
  results: any[],
  setResults: React.Dispatch<React.SetStateAction<any[]>>
): void => {
  setQuizzes(quizzes.filter(quiz => quiz.id !== id));
  // Also delete associated results
  setResults(results.filter(result => result.quizId !== id));
};

export const getQuiz = (id: string, quizzes: Quiz[]): Quiz | undefined => {
  return quizzes.find(quiz => quiz.id === id);
};
