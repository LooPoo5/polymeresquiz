
import { Participant, Question } from '@/context/types';

export interface PdfMetrics {
  scoreOn20: number;
  successRate: number;
  durationInSeconds: number;
}

export interface AnswerOptionProps {
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
}

export interface PdfAnswerItem {
  questionId: string;
  answerId?: string;
  answerIds?: string[];
  answerText?: string;
  isCorrect: boolean;
  points: number;
}
