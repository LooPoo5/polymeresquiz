
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

      if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
        totalPoints += question.points;
        return {
          questionId: question.id,
          answerId: selectedAnswerId,
          isCorrect: true,
          points: question.points
        };
      } else {
        return {
          questionId: question.id,
          answerId: selectedAnswerId,
          isCorrect: false,
          points: 0
        };
      }
    } else if (question.type === 'checkbox') {
      const selectedAnswerIds = selectedAnswers[question.id] || [];
      let questionPoints = 0;
      let correctAnswersCount = 0;

      question.answers.forEach(answer => {
        if (answer.isCorrect) {
          correctAnswersCount++;
        }
      });

      question.answers.forEach(answer => {
        const isSelected = selectedAnswerIds.includes(answer.id);
        if (answer.isCorrect && isSelected) {
          questionPoints += question.points / correctAnswersCount;
        } else if (!answer.isCorrect && isSelected) {
          questionPoints -= question.points / correctAnswersCount;
        }
      });

      questionPoints = Math.max(0, questionPoints);
      totalPoints += questionPoints;

      return {
        questionId: question.id,
        answerIds: selectedAnswerIds,
        isCorrect: questionPoints === question.points,
        points: questionPoints
      };
    } else {
      const answerText = openEndedAnswers[question.id] || '';
      const correctAnswer = question.correctAnswer || '';

      if (answerText.trim() !== '' && correctAnswer.trim() !== '' && answerText.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        totalPoints += question.points;
        return {
          questionId: question.id,
          answerText: answerText,
          isCorrect: true,
          points: question.points
        };
      } else {
        return {
          questionId: question.id,
          answerText: answerText,
          isCorrect: false,
          points: 0
        };
      }
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
