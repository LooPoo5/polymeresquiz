
import { QuizResult } from './types';

export const addResult = (
  result: Omit<QuizResult, 'id'>, 
  results: QuizResult[], 
  setResults: React.Dispatch<React.SetStateAction<QuizResult[]>>
): string => {
  const newResult: QuizResult = {
    ...result,
    id: `result-${Date.now()}`,
  };
  setResults([...results, newResult]);
  return newResult.id;
};

export const getResult = (id: string, results: QuizResult[]): QuizResult | undefined => {
  return results.find(result => result.id === id);
};

export const getQuizResults = (quizId: string, results: QuizResult[]): QuizResult[] => {
  return results.filter(result => result.quizId === quizId);
};

export const deleteResult = (
  id: string, 
  results: QuizResult[], 
  setResults: React.Dispatch<React.SetStateAction<QuizResult[]>>
): void => {
  setResults(results.filter(result => result.id !== id));
};
