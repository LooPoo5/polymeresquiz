
import { QuizResult } from "@/context/types";

export const prepareTrendData = (trendResults: QuizResult[]) => {
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
  
  return { scoreData, durationData };
};
