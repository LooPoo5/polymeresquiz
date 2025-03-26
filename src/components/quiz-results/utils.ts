
import { Question } from '@/context/QuizContext';

// Calculate total possible points for a question
export const calculateTotalPointsForQuestion = (question: Question): number => {
  if (question.type === 'open-ended') {
    return question.points || 1;
  } else if (question.type === 'multiple-choice') {
    // Pour les questions à choix unique
    return question.points || 1;
  } else {
    // Pour les questions à choix multiples (checkbox)
    const correctAnswersCount = question.answers.filter(answer => answer.isCorrect).length;
    if (correctAnswersCount === 0) return 0;
    return question.points || correctAnswersCount;
  }
};
