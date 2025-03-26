
import { Question } from '@/context/QuizContext';

export interface QuizResultAnswer {
  questionId: string;
  answerId?: string;
  answerIds?: string[];
  answerText?: string;
  isCorrect: boolean;
  points: number;
  givenAnswers: string[]; // Combined representation of the user's answers
}
