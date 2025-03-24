
import { Question as QuestionType, QuizResult, Participant } from '@/context/QuizContext';

export const validateParticipantInfo = (
  name: string,
  instructor: string,
  signature: string
): { isValid: boolean; message?: string } => {
  if (!name.trim()) {
    return { isValid: false, message: "Veuillez saisir votre nom" };
  }
  if (!instructor.trim()) {
    return { isValid: false, message: "Veuillez saisir le nom du formateur" };
  }
  if (!signature) {
    return { isValid: false, message: "Veuillez signer" };
  }
  return { isValid: true };
};

export const calculateResults = (
  quiz: any,
  selectedAnswers: Record<string, string[]>,
  openEndedAnswers: Record<string, string>,
  participantInfo: Participant,
  startTime: Date | null
): QuizResult => {
  const answers = quiz.questions.map((question: QuestionType) => {
    if (question.type === 'multiple-choice') {
      const userAnswers = selectedAnswers[question.id] || [];
      const correctAnswer = question.answers.find(a => a.isCorrect);
      const isCorrect = correctAnswer && userAnswers.includes(correctAnswer.id);
      return {
        questionId: question.id,
        answerId: userAnswers[0] || undefined,
        isCorrect: !!isCorrect,
        points: isCorrect ? (correctAnswer?.points || 1) : 0
      };
    } else if (question.type === 'checkbox') {
      const userAnswers = selectedAnswers[question.id] || [];

      let totalPoints = 0;
      let isAllCorrect = true;

      question.answers.forEach(answer => {
        const isSelected = userAnswers.includes(answer.id);
        if (answer.isCorrect && isSelected) {
          totalPoints += answer.points || 1;
        } else if (answer.isCorrect && !isSelected) {
          isAllCorrect = false;
        } else if (!answer.isCorrect && isSelected) {
          isAllCorrect = false;
        }
      });

      return {
        questionId: question.id,
        answerIds: userAnswers,
        isCorrect: isAllCorrect && userAnswers.length > 0,
        points: totalPoints
      };
    } else {
      const userAnswer = openEndedAnswers[question.id] || '';
      return {
        questionId: question.id,
        answerText: userAnswer,
        isCorrect: false,
        points: 0
      };
    }
  });

  const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);

  const maxPoints = quiz.questions.reduce((sum: number, q: QuestionType) => {
    if (q.type === 'open-ended') {
      return sum + q.points;
    } else {
      const correctAnswerPoints = q.answers
        .filter(a => a.isCorrect)
        .reduce((answerSum, a) => answerSum + (a.points || 1), 0);
      
      return sum + correctAnswerPoints;
    }
  }, 0);

  return {
    id: '',
    quizId: quiz.id,
    quizTitle: quiz.title,
    participant: participantInfo,
    answers,
    totalPoints,
    maxPoints,
    startTime: startTime || new Date(),
    endTime: new Date()
  };
};
