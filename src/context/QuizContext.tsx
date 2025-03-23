
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Types
export type QuestionType = "multiple-choice" | "open-ended";

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  answers: Answer[];
  correctAnswer?: string; // For open-ended questions
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
    answerText?: string;
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
  createQuiz: (quiz: Omit<Quiz, "id" | "createdAt">) => void;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  getQuiz: (id: string) => Quiz | undefined;
  results: QuizResult[];
  addResult: (result: Omit<QuizResult, "id">) => void;
  deleteResult: (id: string) => void;
  getResult: (id: string) => QuizResult | undefined;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const QUIZZES_STORAGE_KEY = "polymers-quizzes";
const RESULTS_STORAGE_KEY = "polymers-results";

export const QuizProvider = ({ children }: { children: ReactNode }) => {
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

  const createQuiz = (quiz: Omit<Quiz, "id" | "createdAt">) => {
    const newQuiz: Quiz = {
      ...quiz,
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

  const addResult = (result: Omit<QuizResult, "id">) => {
    const newResult: QuizResult = {
      ...result,
      id: `result-${Date.now()}`,
    };
    setResults([...results, newResult]);
  };

  const deleteResult = (id: string) => {
    setResults(results.filter(result => result.id !== id));
  };

  const getResult = (id: string) => {
    return results.find(result => result.id === id);
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        getQuiz,
        results,
        addResult,
        deleteResult,
        getResult
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
