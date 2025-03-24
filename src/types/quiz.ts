
// Storage keys constants
export const QUIZZES_STORAGE_KEY = 'quizzes';
export const RESULTS_STORAGE_KEY = 'quiz-results';

// Types
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  points?: number; // Points par réponse
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'checkbox';
  points: number;  // Conservé pour la compatibilité avec le code existant
  answers: Answer[];
  correctAnswer?: string;  // Pour les questions ouvertes
  imageUrl?: string; // Ajout de la propriété imageUrl optionnelle
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

export interface QuizContextType {
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
