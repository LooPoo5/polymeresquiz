
import { QuizResult } from "@/context/types";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ParticipantStats, ParticipantQuizSummary } from "./types";
import { calculatePercentile } from "./calculationUtils";

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

  // Calculate new metrics
  // 1. Progress Metrics
  const chronologicalScores = trendResults.map(result => 
    Math.round((result.totalPoints / result.maxPoints) * 20)
  );
  
  const scoreWithDates = trendResults.map(result => ({
    score: Math.round((result.totalPoints / result.maxPoints) * 20),
    date: result.endTime.getTime()
  }));
  
  // Calculate score improvement trend using linear regression
  let improvement = 0;
  if (scoreWithDates.length > 1) {
    // Simple linear regression for trend
    const n = scoreWithDates.length;
    const sumX = scoreWithDates.reduce((sum, item, index) => sum + index, 0);
    const sumY = scoreWithDates.reduce((sum, item) => sum + item.score, 0);
    const sumXY = scoreWithDates.reduce((sum, item, index) => sum + (index * item.score), 0);
    const sumXX = scoreWithDates.reduce((sum, item, index) => sum + (index * index), 0);
    
    improvement = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    // Scale to be per quiz
    improvement = improvement * 100 / quizCount;
  }
  
  const bestScore = Math.max(...chronologicalScores);
  const worstScore = Math.min(...chronologicalScores);
  const firstToLastImprovement = chronologicalScores.length > 1 ? 
    chronologicalScores[chronologicalScores.length - 1] - chronologicalScores[0] : 0;
  
  // 2. Consistency Metrics
  let scoreVariance = 0;
  let averageDeviation = 0;
  
  if (chronologicalScores.length > 1) {
    // Calculate variance
    const squaredDifferences = chronologicalScores.map(score => 
      Math.pow(score - averageScoreOn20, 2)
    );
    scoreVariance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / chronologicalScores.length;
    
    // Calculate average absolute deviation
    const absoluteDifferences = chronologicalScores.map(score => 
      Math.abs(score - averageScoreOn20)
    );
    averageDeviation = absoluteDifferences.reduce((sum, diff) => sum + diff, 0) / chronologicalScores.length;
  }
  
  // Calculate consistency score (0-100) where 100 is most consistent
  // We use a formula where 0 variance = 100% consistency, max variance (20 points) = 0% consistency
  const maxPossibleVariance = 100; // Maximum theoretical variance (if scores vary from 0 to 20)
  const consistencyScore = Math.max(0, 100 - (scoreVariance / maxPossibleVariance * 100));
  
  // 3. Time Efficiency Metrics
  const averageTimePerQuestion = participantResults.reduce((sum, result) => {
    const duration = Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000);
    const questionCount = result.answers.length;
    return sum + (duration / questionCount);
  }, 0) / quizCount;
  
  const fastestQuiz = participantResults.reduce((fastest, result) => {
    const duration = Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000);
    if (!fastest || duration < fastest.duration) {
      return { 
        id: result.id, 
        title: result.quizTitle, 
        duration 
      };
    }
    return fastest;
  }, null as { id: string, title: string, duration: number } | null);
  
  // Calculate time improvement
  let timeImprovement = 0;
  if (trendResults.length > 1) {
    const firstQuizTime = Math.floor(
      (trendResults[0].endTime.getTime() - trendResults[0].startTime.getTime()) / 1000
    );
    const lastQuizTime = Math.floor(
      (trendResults[trendResults.length - 1].endTime.getTime() - trendResults[trendResults.length - 1].startTime.getTime()) / 1000
    );
    
    // Calculate percentage improvement (negative means faster)
    if (firstQuizTime > 0) {
      timeImprovement = ((firstQuizTime - lastQuizTime) / firstQuizTime) * 100;
    }
  }
  
  // 4. Achievement Metrics
  const perfectScores = chronologicalScores.filter(score => score === 20).length;
  const excellentScores = chronologicalScores.filter(score => score >= 16).length;
  const passRate = (chronologicalScores.filter(score => score >= 10).length / chronologicalScores.length) * 100;
  
  // Determine mastery level
  let masteryLevel = "Débutant";
  if (averageScoreOn20 >= 18) {
    masteryLevel = "Expert";
  } else if (averageScoreOn20 >= 15) {
    masteryLevel = "Avancé";
  } else if (averageScoreOn20 >= 12) {
    masteryLevel = "Intermédiaire";
  }

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
    // New metrics
    progressMetrics: {
      improvement,
      bestScore,
      worstScore,
      firstToLastImprovement
    },
    consistencyMetrics: {
      scoreVariance,
      averageDeviation,
      consistencyScore
    },
    timeEfficiencyMetrics: {
      averageTimePerQuestion,
      fastestQuiz: fastestQuiz ? {
        id: fastestQuiz.id,
        title: fastestQuiz.title,
        durationInSeconds: fastestQuiz.duration
      } : {
        id: "",
        title: "",
        durationInSeconds: 0
      },
      timeImprovement
    },
    achievementMetrics: {
      perfectScores,
      excellentScores,
      passRate,
      masteryLevel
    }
  };
};
