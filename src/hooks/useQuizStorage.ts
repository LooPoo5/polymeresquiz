
import { useState, useEffect } from 'react';
import { Quiz, QuizResult } from '@/context/types';

// Storage keys constants
const QUIZZES_STORAGE_KEY = 'quizzes';
const RESULTS_STORAGE_KEY = 'quiz-results';

export const useQuizStorage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedQuizzes = localStorage.getItem(QUIZZES_STORAGE_KEY);
    const storedResults = localStorage.getItem(RESULTS_STORAGE_KEY);

    if (storedQuizzes) {
      const parsedQuizzes = JSON.parse(storedQuizzes);
      // Convert string dates back to Date objects
      const quizzesWithDates = parsedQuizzes.map((quiz: any) => ({
        ...quiz,
        createdAt: new Date(quiz.createdAt)
      }));
      setQuizzes(quizzesWithDates);
    } else {
      // Add sample quiz if no quizzes exist
      setQuizzes([
        {
          id: "sample-quiz-1",
          title: "Introduction aux Polymères",
          imageUrl: "https://images.unsplash.com/photo-1603695980803-c98161d4647b?q=80&w=1000&auto=format&fit=crop",
          questions: [
            {
              id: "q1",
              text: "Qu'est-ce qu'un polymère?",
              type: "multiple-choice",
              points: 2,
              answers: [
                { id: "a1", text: "Un type de métal", isCorrect: false },
                { id: "a2", text: "Une molécule composée de motifs répétitifs", isCorrect: true },
                { id: "a3", text: "Un élément chimique", isCorrect: false },
                { id: "a4", text: "Un minéral naturel", isCorrect: false },
              ],
            },
            {
              id: "q2",
              text: "Expliquez le concept de polymérisation par condensation.",
              type: "open-ended",
              points: 3,
              answers: [],
              correctAnswer: "La polymérisation par condensation est une réaction qui implique la libération d'une petite molécule (souvent de l'eau) lorsque deux monomères se lient pour former une chaîne polymère."
            },
          ],
          createdAt: new Date(),
        },
      ]);
    }

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      // Convert string dates back to Date objects
      const resultsWithDates = parsedResults.map((result: any) => ({
        ...result,
        startTime: new Date(result.startTime),
        endTime: new Date(result.endTime)
      }));
      setResults(resultsWithDates);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  return {
    quizzes,
    setQuizzes,
    results,
    setResults
  };
};
