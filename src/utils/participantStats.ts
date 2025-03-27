
import { QuizResult } from "@/context/types";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

export const getParticipantStats = (
  participantName: string,
  allResults: QuizResult[]
): ParticipantStats | null => {
  // Filter results for this participant
  const participantResults = allResults.filter(
    (result) => result.participant.name === participantName
  );

  if (participantResults.length === 0) {
    return null;
  }

  // Sort by date (newest first)
  const sortedResults = [...participantResults].sort(
    (a, b) => b.endTime.getTime() - a.endTime.getTime()
  );

  // Basic stats
  const quizCount = participantResults.length;
  const instructor = participantResults[0].participant.instructor;
  const totalScoreOn20 = participantResults.reduce(
    (sum, result) => sum + Math.round((result.totalPoints / result.maxPoints) * 20),
    0
  );
  const totalDuration = participantResults.reduce(
    (sum, result) =>
      sum + Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000),
    0
  );

  const averageScoreOn20 = totalScoreOn20 / quizCount;
  const averageDurationInSeconds = totalDuration / quizCount;
  const firstQuizDate = new Date(
    Math.min(...participantResults.map((r) => r.endTime.getTime()))
  );
  const lastQuizDate = new Date(
    Math.max(...participantResults.map((r) => r.endTime.getTime()))
  );

  // Prepare quiz summaries
  const quizzes: ParticipantQuizSummary[] = sortedResults.map((result) => {
    const durationInSeconds = Math.floor(
      (result.endTime.getTime() - result.startTime.getTime()) / 1000
    );
    const scoreOn20 = Math.round((result.totalPoints / result.maxPoints) * 20);
    const daysAgo = differenceInDays(new Date(), result.endTime);
    const timeAgo = formatDistanceToNow(result.endTime, { 
      addSuffix: true,
      locale: fr 
    });

    return {
      id: result.id,
      title: result.quizTitle,
      date: result.endTime,
      scoreOn20,
      durationInSeconds,
      daysAgo,
      timeAgo,
    };
  });

  // Prepare trend data (chronological order)
  const trendResults = [...participantResults].sort(
    (a, b) => a.endTime.getTime() - b.endTime.getTime()
  );

  const scoreData = trendResults.map((result) => {
    const scoreOn20 = Math.round((result.totalPoints / result.maxPoints) * 20);
    const date = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
    }).format(result.endTime);

    return { date, score: scoreOn20 };
  });

  const durationData = trendResults.map((result) => {
    const durationInSeconds = Math.floor(
      (result.endTime.getTime() - result.startTime.getTime()) / 1000
    );
    const date = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
    }).format(result.endTime);

    return { date, duration: Math.floor(durationInSeconds / 60) }; // Convert to minutes
  });

  // Calculate comparison stats with other participants
  const otherResults = allResults.filter(
    (result) => result.participant.name !== participantName
  );

  const globalStats = {
    averageScore: 0,
    averageDuration: 0,
    scores: [] as number[],
    durations: [] as number[],
  };

  if (otherResults.length > 0) {
    // Calculate global averages
    const globalTotalScoreOn20 = otherResults.reduce(
      (sum, result) => sum + Math.round((result.totalPoints / result.maxPoints) * 20),
      0
    );
    const globalTotalDuration = otherResults.reduce(
      (sum, result) =>
        sum +
        Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000),
      0
    );

    globalStats.averageScore = globalTotalScoreOn20 / otherResults.length;
    globalStats.averageDuration = globalTotalDuration / otherResults.length;

    // Gather all scores and durations for percentile calculations
    globalStats.scores = otherResults.map((result) =>
      Math.round((result.totalPoints / result.maxPoints) * 20)
    );
    globalStats.durations = otherResults.map((result) =>
      Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000)
    );
  }

  // Calculate percentiles (approximated)
  const scorePercentile = calculatePercentile(averageScoreOn20, globalStats.scores);
  // For duration, lower is better, so we invert the logic
  const speedPercentile = 100 - calculatePercentile(averageDurationInSeconds, globalStats.durations);

  return {
    name: participantName,
    instructor,
    quizCount,
    averageScoreOn20,
    averageDurationInSeconds,
    firstQuizDate,
    lastQuizDate,
    quizzes,
    scoreData,
    durationData,
    comparisonStats: {
      globalAverageScore: globalStats.averageScore,
      globalAverageDuration: globalStats.averageDuration,
      scorePercentile,
      speedPercentile,
    },
  };
};

// Helper function to calculate percentile
function calculatePercentile(value: number, dataset: number[]): number {
  if (dataset.length === 0) return 50; // Default to middle if no data

  // Count how many values are less than our value
  const count = dataset.filter((item) => item < value).length;
  return Math.round((count / dataset.length) * 100);
}

// Format seconds to minutes and seconds
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  } else if (remainingSeconds === 0) {
    return `${minutes} min`;
  } else {
    return `${minutes} min ${remainingSeconds} sec`;
  }
};
