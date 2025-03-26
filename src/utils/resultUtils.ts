
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
      
      // Compter le nombre total de bonnes réponses pour cette question
      const correctAnswers = question.answers.filter(answer => answer.isCorrect);
      const correctAnswersCount = correctAnswers.length;
      
      // Ne pas continuer si aucune bonne réponse ou si aucune réponse sélectionnée
      if (correctAnswersCount === 0 || selectedAnswerIds.length === 0) {
        return {
          questionId: question.id,
          answerIds: selectedAnswerIds,
          isCorrect: false,
          points: 0
        };
      }

      // Compter combien de bonnes et mauvaises réponses ont été sélectionnées
      let correctSelected = 0;
      let incorrectSelected = 0;

      question.answers.forEach(answer => {
        if (selectedAnswerIds.includes(answer.id)) {
          if (answer.isCorrect) {
            correctSelected++;
          } else {
            incorrectSelected++;
          }
        }
      });

      // Calcul des points
      let questionPoints = 0;
      
      // Si toutes les bonnes réponses sont sélectionnées et aucune mauvaise
      if (correctSelected === correctAnswersCount && incorrectSelected === 0) {
        questionPoints = question.points;
      } 
      // Points partiels: uniquement si aucune mauvaise réponse n'est sélectionnée
      else if (correctSelected > 0 && incorrectSelected === 0) {
        // Attribuer les points proportionnellement au nombre de bonnes réponses sélectionnées
        questionPoints = Math.round((correctSelected / correctAnswersCount) * question.points);
      }
      // Aucun point si des mauvaises réponses sont sélectionnées
      
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
