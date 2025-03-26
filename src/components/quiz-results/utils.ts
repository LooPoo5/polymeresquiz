
import { Question } from '@/context/QuizContext';

// Calculate total possible points for a question
export const calculateTotalPointsForQuestion = (question: Question): number => {
  if (question.type === 'checkbox') {
    // For checkbox, sum the points of all correct answers
    return question.answers
      .filter(answer => answer.isCorrect)
      .reduce((total, answer) => total + (answer.points || 1), 0);
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
    // Get all correct answers with their points
    const correctAnswers = question.answers.filter(answer => answer.isCorrect);
    const correctAnswersMap = new Map(
      correctAnswers.map(answer => [answer.id, answer.points || 1])
    );
    
    // Calculate points for each selected correct answer
    let points = 0;
    
    givenAnswers.forEach(answerId => {
      if (correctAnswersMap.has(answerId)) {
        points += correctAnswersMap.get(answerId) || 1; // Use answer points or default to 1
      }
    });
    
    return points;
  }
  
  return 0;
};
