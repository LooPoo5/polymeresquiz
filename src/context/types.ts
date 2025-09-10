
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  points?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'checkbox';
  points: number;
  answers: Answer[];
  correctAnswer?: string;
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
    answerIds?: string[];
    answerText?: string;
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
  setQuizzes: (quizzes: Quiz[]) => void;
  setResults: (results: QuizResult[]) => void;
}
