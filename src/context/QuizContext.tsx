import React, { createContext, useContext, useState, useEffect } from 'react';

// Storage keys constants
const QUIZZES_STORAGE_KEY = 'quizzes';
const RESULTS_STORAGE_KEY = 'quiz-results';

// Types
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'checkbox' | 'text' | 'satisfaction';
  points: number;
  answers: Answer[];
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  imageUrl?: string;
  questions: Question[];
  createdAt: Date;
}

export interface Participant {
  name: string;
  date: string;
  instructor: string;
  signature: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  participant: Participant;
  answers: {
    questionId: string;
    answerId?: string;
    answerIds?: string[];  // Pour les questions à cases à cocher (multiple réponses)
    answerText?: string;   // Pour les questions ouvertes
    isCorrect: boolean;
    points: number;
  }[];
  totalPoints: number;
  maxPoints: number;
  startTime: Date;
  endTime: Date;
}

interface QuizContextType {
  quizzes: Quiz[];
  results: QuizResult[];
  createQuiz: (quizData: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  getQuiz: (id: string) => Quiz | undefined;
  addResult: (result: Omit<QuizResult, 'id'>) => string;
  getResult: (id: string) => QuizResult | undefined;
  getQuizResults: (quizId: string) => QuizResult[];
  deleteResult: (id: string) => void;
}

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
