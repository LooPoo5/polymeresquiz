
import { Quiz, QuizResult } from '@/context/QuizContext';

export interface QuizChartData {
  name: string;
  fullTitle: string;
  count: number;
  id: string;
  shortName: string;
}

export const prepareChartData = (quizzes: Quiz[], results: QuizResult[]): QuizChartData[] => {
  const quizUsageCounts: Record<string, number> = {};
  
  // Count the number of times each quiz has been taken
  results.forEach(result => {
    if (quizUsageCounts[result.quizId]) {
      quizUsageCounts[result.quizId]++;
    } else {
      quizUsageCounts[result.quizId] = 1;
    }
  });
  
  // Map to the format needed for the chart
  return quizzes.map(quiz => ({
    name: quiz.title,
    fullTitle: quiz.title,
    count: quizUsageCounts[quiz.id] || 0,
    id: quiz.id,
    // Truncate the title for legend display
    shortName: quiz.title.length > 20 ? quiz.title.substring(0, 20) + '...' : quiz.title
  })).sort((a, b) => b.count - a.count).slice(0, 8); // Sort by popularity (descending) and limit to 8 items
};
