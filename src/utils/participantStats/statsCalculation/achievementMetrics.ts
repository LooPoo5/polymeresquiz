
export const calculateAchievementMetrics = (chronologicalScores: number[]) => {
  const perfectScores = chronologicalScores.filter(score => score === 20).length;
  const excellentScores = chronologicalScores.filter(score => score >= 16).length;
  const passRate = (chronologicalScores.filter(score => score >= 10).length / chronologicalScores.length) * 100;
  
  // Determine mastery level
  let masteryLevel = "Débutant";
  const averageScoreOn20 = chronologicalScores.reduce((sum, score) => sum + score, 0) / chronologicalScores.length;
  
  if (averageScoreOn20 >= 18) {
    masteryLevel = "Expert";
  } else if (averageScoreOn20 >= 15) {
    masteryLevel = "Avancé";
  } else if (averageScoreOn20 >= 12) {
    masteryLevel = "Intermédiaire";
  }

  return {
    perfectScores,
    excellentScores,
    passRate,
    masteryLevel
  };
};
