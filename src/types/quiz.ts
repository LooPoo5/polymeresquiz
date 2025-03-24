
// Types for the Quiz application
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
  correctAnswer?: string; // Added for text/open-ended questions
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
