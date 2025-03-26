
import { Question } from '@/context/QuizContext';

// Calculate total possible points for a question
export const calculateTotalPointsForQuestion = (question: Question): number => {
  if (question.type === 'open-ended') {
    return question.points || 1;
  } else {
    // For multiple-choice and checkbox questions, sum the points of all correct answers
    return question.answers
      .filter(answer => answer.isCorrect)
      .reduce((sum, answer) => sum + (answer.points || 1), 0);
  }
};
