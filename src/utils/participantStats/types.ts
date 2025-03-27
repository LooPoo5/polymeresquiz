
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

export interface ProgressMetrics {
  improvement: number; // Positive or negative score trend
  bestScore: number;
  worstScore: number;
  firstToLastImprovement: number; // Difference between first and last quiz
}

export interface ConsistencyMetrics {
  scoreVariance: number; // How consistent are scores
  averageDeviation: number; // Average deviation from mean
  consistencyScore: number; // 0-100 scale where 100 is perfectly consistent
}

export interface TimeEfficiencyMetrics {
  averageTimePerQuestion: number; // in seconds
  fastestQuiz: {
    id: string;
    title: string;
    durationInSeconds: number;
  };
  timeImprovement: number; // Percentage improvement in time
}

export interface AchievementMetrics {
  perfectScores: number; // Number of 20/20 scores
  excellentScores: number; // Number of 16+/20 scores
  passRate: number; // Percentage of quizzes passed (>10/20)
  masteryLevel: string; // "Beginner", "Intermediate", "Advanced", "Expert"
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
  // New metrics
  progressMetrics: ProgressMetrics;
  consistencyMetrics: ConsistencyMetrics;
  timeEfficiencyMetrics: TimeEfficiencyMetrics;
  achievementMetrics: AchievementMetrics;
}
