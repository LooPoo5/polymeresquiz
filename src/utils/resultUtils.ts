
import { Participant, Question, Quiz } from '@/context/types';

/**
 * Calculates quiz results based on user answers
 */
export const calculateResults = (quiz: Quiz, selectedAnswers: Record<string, string[]>, openEndedAnswers: Record<string, string>, participant: Participant, startTime: Date | null) => {
  let totalPoints = 0;
  let maxPoints = 0;

  const answers = quiz.questions.map(question => {
    maxPoints += question.points;
    
    if (question.type === 'multiple-choice') {
      const selectedAnswerId = selectedAnswers[question.id]?.[0];
      const correctAnswer = question.answers.find(answer => answer.isCorrect);

      // Check if the selected answer is correct
      const isCorrect = selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id;
      const points = isCorrect ? question.points : 0;
      
      totalPoints += points;
      
      return {
        questionId: question.id,
        answerId: selectedAnswerId,
        isCorrect: isCorrect,
        points: points
      };
    } else if (question.type === 'checkbox') {
      const selectedAnswerIds = selectedAnswers[question.id] || [];
      
      // Get all correct answers
      const correctAnswers = question.answers.filter(answer => answer.isCorrect);
      const correctAnswerIds = correctAnswers.map(answer => answer.id);
      
      // Count correct and incorrect selections
      let correctSelected = 0;
      let incorrectSelected = 0;
      
      selectedAnswerIds.forEach(id => {
        if (correctAnswerIds.includes(id)) {
          correctSelected++;
        } else {
          incorrectSelected++;
        }
      });
      
      let isCorrect = false;
      let points = 0;
      
      // Only award points if all correct answers are selected and no incorrect ones
      if (correctSelected === correctAnswerIds.length && incorrectSelected === 0) {
        isCorrect = true;
        points = question.points;
      }
      
      totalPoints += points;
      
      return {
        questionId: question.id,
        answerIds: selectedAnswerIds,
        isCorrect: isCorrect,
        points: points
      };
    } else {
      // Open-ended question
      const answerText = openEndedAnswers[question.id] || '';
      const correctAnswer = question.correctAnswer || '';
      
      const isCorrect = answerText.trim() !== '' && 
                        correctAnswer.trim() !== '' && 
                        answerText.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      
      const points = isCorrect ? question.points : 0;
      totalPoints += points;
      
      return {
        questionId: question.id,
        answerText: answerText,
        isCorrect: isCorrect,
        points: points
      };
    }
  });

  return {
    quizId: quiz.id,
    quizTitle: quiz.title,
    participant: participant,
    answers: answers,
    totalPoints: totalPoints,
    maxPoints: maxPoints,
    startTime: startTime || new Date(),
    endTime: new Date()
  };
};
