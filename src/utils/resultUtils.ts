
import { Participant, Question, Quiz } from '@/context/types';

/**
 * Calculates quiz results based on user answers
 */
export const calculateResults = (quiz: Quiz, selectedAnswers: Record<string, string[]>, openEndedAnswers: Record<string, string>, participant: Participant, startTime: Date | null) => {
  let totalPoints = 0;
  let maxPoints = 0;

  const answers = quiz.questions.map(question => {
    // Calculate maximum points for this question
    let questionMaxPoints = 0;
    
    if (question.type === 'checkbox') {
      // For checkbox questions, max points = number of correct answers (each worth 1 point)
      questionMaxPoints = question.answers.filter(answer => answer.isCorrect).length;
    } else {
      // For multiple-choice and open-ended, max points = question.points
      questionMaxPoints = question.points;
    }
    
    maxPoints += questionMaxPoints;
    
    if (question.type === 'multiple-choice') {
      const selectedAnswerId = selectedAnswers[question.id]?.[0];
      const correctAnswer = question.answers.find(answer => answer.isCorrect);

      // Check if the selected answer is correct
      const isCorrect = selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id;
      
      // Use the points value from the question
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
      
      // Count correct selections (each worth 1 point)
      let points = 0;
      let correctSelected = 0;
      
      selectedAnswerIds.forEach(id => {
        if (correctAnswerIds.includes(id)) {
          points += 1; // Each correct answer is worth 1 point
          correctSelected++;
        }
      });
      
      // Determine if completely correct (all correct answers selected, no incorrect ones)
      const isCompletelyCorrect = correctSelected === correctAnswerIds.length && 
                                  selectedAnswerIds.length === correctSelected;
      
      totalPoints += points;
      
      return {
        questionId: question.id,
        answerIds: selectedAnswerIds,
        isCorrect: isCompletelyCorrect,
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
