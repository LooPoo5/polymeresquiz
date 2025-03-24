
import { Question } from '@/context/QuizContext';

// Calculate total possible points for a question
export const calculateTotalPointsForQuestion = (question: Question): number => {
  if (question.type === 'text') {
    return question.points;
  } else if (question.type === 'multiple-choice' || question.type === 'checkbox' || question.type === 'satisfaction') {
    // For multiple-choice, checkbox and satisfaction questions, sum the points of all correct answers
    return question.answers
      .filter(answer => answer.isCorrect)
      .reduce((sum, answer) => sum + (answer.points || 1), 0);
  } else {
    // Fallback for any other question types
    return question.points;
  }
};
