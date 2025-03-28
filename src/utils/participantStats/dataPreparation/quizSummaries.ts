
import { QuizResult } from "@/context/types";
import { ParticipantQuizSummary } from "../types";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const prepareQuizSummaries = (sortedResults: QuizResult[]): ParticipantQuizSummary[] => {
  return sortedResults.map((result) => {
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
};
