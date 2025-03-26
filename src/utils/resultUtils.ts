
import { Participant, Question, Quiz } from '@/context/types';
import { calculateEarnedPoints, calculateTotalPointsForQuestion } from '@/components/quiz-results/utils';

/**
 * Calculates quiz results based on user answers
 */
export const calculateResults = (quiz: Quiz, selectedAnswers: Record<string, string[]>, openEndedAnswers: Record<string, string>, participant: Participant, startTime: Date | null) => {
  let totalPoints = 0;
  let maxPoints = 0;

  const answers = quiz.questions.map(question => {
    // Calculate max points for this question
    const questionMaxPoints = calculateTotalPointsForQuestion(question);
    maxPoints += questionMaxPoints;

    if (question.type === 'multiple-choice') {
      const selectedAnswerId = selectedAnswers[question.id]?.[0];
      const correctAnswer = question.answers.find(answer => answer.isCorrect);
      const selectedAnswerIds = selectedAnswerId ? [selectedAnswerId] : [];
      
      // Calculate earned points for this answer
      const earnedPoints = calculateEarnedPoints(question, selectedAnswerIds);
      totalPoints += earnedPoints;

      return {
        questionId: question.id,
        answerId: selectedAnswerId,
        isCorrect: earnedPoints > 0,
        points: earnedPoints
      };
    } else if (question.type === 'checkbox') {
      const selectedAnswerIds = selectedAnswers[question.id] || [];
      
      // Calculate earned points for checkbox answers
      const earnedPoints = calculateEarnedPoints(question, selectedAnswerIds);
      totalPoints += earnedPoints;

      return {
        questionId: question.id,
        answerIds: selectedAnswerIds,
        isCorrect: earnedPoints === questionMaxPoints,
        points: earnedPoints
      };
    } else {
      const answerText = openEndedAnswers[question.id] || '';
      const correctAnswer = question.correctAnswer || '';
      
      let earnedPoints = 0;
      if (answerText.trim() !== '' && correctAnswer.trim() !== '' && 
          answerText.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        earnedPoints = question.points;
      }
      
      totalPoints += earnedPoints;

      return {
        questionId: question.id,
        answerText: answerText,
        isCorrect: earnedPoints > 0,
        points: earnedPoints
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
