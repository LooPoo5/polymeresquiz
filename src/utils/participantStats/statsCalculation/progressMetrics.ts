
export const calculateProgressMetrics = (
  chronologicalScores: number[],
  scoreWithDates: Array<{ score: number; date: number }>,
  quizCount: number
) => {
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
    
  return {
    improvement,
    bestScore,
    worstScore,
    firstToLastImprovement
  };
};
