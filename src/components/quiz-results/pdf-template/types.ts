import { Participant, Question } from '@/context/types';

export interface PdfMetrics {
  scoreOn20: number;
  successRate: number;
  durationInSeconds: number;
}

export interface AnswerOptionProps {
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  points?: number;
}

export interface PdfAnswerItem {
  questionId: string;
  answerId?: string;
  answerIds?: string[];
  answerText?: string;
  isCorrect: boolean;
  points: number;
}

export interface SummaryItemProps {
  label: string;
  value: string;
}

export interface PdfTemplateProps {
  result: {
    quizTitle: string;
    participant: Participant;
    answers: PdfAnswerItem[];
    totalPoints: number;
    maxPoints: number;
    endTime: Date;
  };
  questionsMap: Record<string, Question>;
  metrics: PdfMetrics;
  version?: number;
}
