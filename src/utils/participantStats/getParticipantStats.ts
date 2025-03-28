
import { QuizResult } from "@/context/types";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ParticipantStats, ParticipantQuizSummary } from "./types";
import { calculatePercentile } from "./calculationUtils";
import { calculateComparisonStats } from "./statsCalculation/comparisonStats";
import { calculateAchievementMetrics } from "./statsCalculation/achievementMetrics";
import { calculateConsistencyMetrics } from "./statsCalculation/consistencyMetrics";
import { calculateProgressMetrics } from "./statsCalculation/progressMetrics";
import { calculateTimeEfficiencyMetrics } from "./statsCalculation/timeEfficiencyMetrics";
import { prepareQuizSummaries } from "./dataPreparation/quizSummaries";
import { prepareTrendData } from "./dataPreparation/trendData";

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
  const quizzes = prepareQuizSummaries(sortedResults);

  // Prepare trend data (chronological order)
  const trendResults = [...participantResults].sort(
    (a, b) => a.endTime.getTime() - b.endTime.getTime()
  );

  const { scoreData, durationData } = prepareTrendData(trendResults);

  // Calculate comparison stats with other participants
  const otherResults = allResults.filter(
    (result) => result.participant.name !== participantName
  );

  const comparisonStats = calculateComparisonStats(
    averageScoreOn20,
    averageDurationInSeconds,
    otherResults
  );

  // Calculate metrics for chronological scores
  const chronologicalScores = trendResults.map(result => 
    Math.round((result.totalPoints / result.maxPoints) * 20)
  );
  
  const scoreWithDates = trendResults.map(result => ({
    score: Math.round((result.totalPoints / result.maxPoints) * 20),
    date: result.endTime.getTime()
  }));

  // Calculate specific metrics
  const progressMetrics = calculateProgressMetrics(chronologicalScores, scoreWithDates, quizCount);
  const consistencyMetrics = calculateConsistencyMetrics(chronologicalScores, averageScoreOn20);
  const timeEfficiencyMetrics = calculateTimeEfficiencyMetrics(participantResults, trendResults);
  const achievementMetrics = calculateAchievementMetrics(chronologicalScores);

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
    comparisonStats,
    progressMetrics,
    consistencyMetrics,
    timeEfficiencyMetrics,
    achievementMetrics
  };
};
