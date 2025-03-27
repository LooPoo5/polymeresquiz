
import { QuizResult } from "@/context/types";

export interface ParticipantQuizSummary {
  id: string;
  title: string;
  date: Date;
  scoreOn20: number;
  durationInSeconds: number;
  daysAgo: number;
  timeAgo: string;
}

export interface ParticipantStats {
  name: string;
  instructor: string;
  quizCount: number;
  averageScoreOn20: number;
  averageDurationInSeconds: number;
  firstQuizDate: Date;
  lastQuizDate: Date;
  quizzes: ParticipantQuizSummary[];
  // Score trends over time data
  scoreData: {
    date: string;
    score: number;
  }[];
  // Duration trends over time data
  durationData: {
    date: string;
    duration: number;
  }[];
  // Compare to other participants
  comparisonStats: {
    globalAverageScore: number;
    globalAverageDuration: number;
    scorePercentile: number; // Higher is better
    speedPercentile: number; // Higher is better (faster)
  };
}
