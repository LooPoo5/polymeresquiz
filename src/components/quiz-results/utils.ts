
import { Question } from '@/context/QuizContext';

/**
 * Calculates the total number of points for a question
 */
export const calculateTotalPointsForQuestion = (question: Question): number => {
  // If the question has explicit points, use that value
  if (question.points !== undefined) {
    return question.points;
  }
  
  // Default is 1 point per question if not specified
  return 1;
};

/**
 * Calculates earned points for a given question and selected answers
 */
export const calculateEarnedPoints = (question: Question, selectedAnswerIds: string[]): number => {
  // If it's an empty selection, no points
  if (!selectedAnswerIds || selectedAnswerIds.length === 0) {
    return 0;
  }
  
  // For different question types
  switch (question.type) {
    case 'multiple-choice': {
      const selectedAnswer = question.answers.find(a => a.id === selectedAnswerIds[0]);
      return selectedAnswer && selectedAnswer.isCorrect ? (question.points || 1) : 0;
    }
    
    case 'checkbox': {
      // For checkbox questions, points are awarded proportionally
      // If all correct answers are selected and no incorrect answers are selected
      const correctAnswerIds = question.answers
        .filter(answer => answer.isCorrect)
        .map(answer => answer.id);
      
      const incorrectlySelected = selectedAnswerIds
        .some(id => !correctAnswerIds.includes(id));
      
      const allCorrectSelected = correctAnswerIds
        .every(id => selectedAnswerIds.includes(id));
      
      // All or nothing scoring for checkbox questions
      if (allCorrectSelected && !incorrectlySelected) {
        return question.points || 1;
      }
      return 0;
    }
    
    case 'open-ended': {
      // This is typically handled elsewhere for open-ended questions
      return 0;
    }
    
    default:
      return 0;
  }
};
