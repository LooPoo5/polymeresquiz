
export const calculateConsistencyMetrics = (
  chronologicalScores: number[],
  averageScoreOn20: number
) => {
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

  return {
    scoreVariance,
    averageDeviation,
    consistencyScore
  };
};
