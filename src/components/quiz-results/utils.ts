
import { Question } from '@/context/QuizContext';

// Calculate total possible points for a question
export const calculateTotalPointsForQuestion = (question: Question): number => {
  if (question.type === 'open-ended') {
    return question.points || 1;
  } else if (question.type === 'multiple-choice') {
    // For multiple-choice, find the correct answer and return its points or the question points
    const correctAnswer = question.answers.find(answer => answer.isCorrect);
    return correctAnswer?.points || question.points || 1;
  } else {
    // For checkbox questions, sum the points of all correct answers
    const correctAnswersPoints = question.answers
      .filter(answer => answer.isCorrect)
      .reduce((sum, answer) => sum + (answer.points || 1), 0);
    
    // If there are no points assigned to correct answers, use the question points
    return correctAnswersPoints > 0 ? correctAnswersPoints : question.points || 1;
  }
};

// Calculate points earned for a given answer
export const calculateEarnedPoints = (question: Question, selectedAnswerIds: string[]): number => {
  if (question.type === 'open-ended') {
    // For open-ended questions, it's either full points or zero
    return selectedAnswerIds.length > 0 ? question.points || 1 : 0;
  } else if (question.type === 'multiple-choice') {
    // For multiple-choice, check if the selected answer is correct
    const selectedAnswer = question.answers.find(a => selectedAnswerIds.includes(a.id));
    if (selectedAnswer?.isCorrect) {
      return selectedAnswer.points || question.points || 1;
    }
    return 0;
  } else {
    // For checkbox questions, calculate points based on correct selections
    let points = 0;
    
    question.answers.forEach(answer => {
      const isSelected = selectedAnswerIds.includes(answer.id);
      
      if (answer.isCorrect && isSelected) {
        // Add points for correctly selected answers
        points += answer.points || 1;
      }
    });
    
    return points;
  }
};
