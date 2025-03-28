
import { QuizResult } from "@/context/types";
import { calculatePercentile } from "../calculationUtils";

export const calculateComparisonStats = (
  averageScoreOn20: number,
  averageDurationInSeconds: number,
  otherResults: QuizResult[]
) => {
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
    globalAverageScore: globalStats.averageScore,
    globalAverageDuration: globalStats.averageDuration,
    scorePercentile,
    speedPercentile,
  };
};
