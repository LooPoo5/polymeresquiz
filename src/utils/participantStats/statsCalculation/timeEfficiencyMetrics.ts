
import { QuizResult } from "@/context/types";

export const calculateTimeEfficiencyMetrics = (
  participantResults: QuizResult[],
  trendResults: QuizResult[]
) => {
  const averageTimePerQuestion = participantResults.reduce((sum, result) => {
    const duration = Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000);
    const questionCount = result.answers.length;
    return sum + (duration / questionCount);
  }, 0) / participantResults.length;
  
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

  return {
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
  };
};
