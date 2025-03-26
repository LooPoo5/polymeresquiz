
import { Question } from '@/context/QuizContext';

// Calculate total possible points for a question
export const calculateTotalPointsForQuestion = (question: Question): number => {
  // Always return the points defined for the question, regardless of question type
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
    
    // Count selected correct and incorrect answers
    let correctSelected = 0;
    let incorrectSelected = 0;
    
    givenAnswers.forEach(answerId => {
      if (correctAnswersIds.includes(answerId)) {
        correctSelected++;
      } else {
        incorrectSelected++;
      }
    });
    
    // If any incorrect answers are selected, no points
    if (incorrectSelected > 0) {
      return 0;
    }
    
    // If all correct answers are selected, full points
    if (correctSelected === correctAnswersIds.length) {
      return question.points;
    }
    
    // No partial points for checkbox questions
    return 0;
  }
  
  return 0;
};
