
import { Question } from '@/context/QuizContext';

// Calculate total possible points for a question
export const calculateTotalPointsForQuestion = (question: Question): number => {
  if (question.type === 'checkbox') {
    // For checkbox, each correct answer is worth 1 point
    return question.answers.filter(answer => answer.isCorrect).length;
  }
  
  // For multiple-choice and open-ended, return the assigned points
  return question.points;
};

// Calculate points earned for a specific answer
export const calculateEarnedPoints = (question: Question, givenAnswers: string[]): number => {
  if (question.type === 'open-ended') {
    const correctAnswer = question.correctAnswer || '';
    const userAnswer = givenAnswers[0] || '';
    
    if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      return question.points;
    }
    return 0;
  } 
  else if (question.type === 'multiple-choice') {
    const selectedAnswerId = givenAnswers[0];
    const correctAnswer = question.answers.find(answer => answer.isCorrect);
    
    if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
      return question.points;
    }
    return 0;
  } 
  else if (question.type === 'checkbox') {
    // Get all correct answers
    const correctAnswers = question.answers.filter(answer => answer.isCorrect);
    const correctAnswersIds = correctAnswers.map(answer => answer.id);
    
    // Count correct selections (each worth 1 point)
    let points = 0;
    
    givenAnswers.forEach(answerId => {
      if (correctAnswersIds.includes(answerId)) {
        points += 1; // Each correct answer is worth 1 point
      }
    });
    
    // Return the earned points (no penalty for incorrect selections)
    return points;
  }
  
  return 0;
};
