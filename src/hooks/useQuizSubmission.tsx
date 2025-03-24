import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { Question, Participant, Quiz } from '@/types/quiz';
import { toast } from '@/hooks/use-toast';

interface UseQuizSubmission {
  submitting: boolean;
  submitted: boolean;
  resultId: string | null;
  handleSubmitQuiz: (participant: Participant, selectedAnswers: Record<string, string[]>, openEndedAnswers: Record<string, string>, startTime: Date) => Promise<void>;
}

const useQuizSubmission = (quizId: string): UseQuizSubmission => {
  const { addResult, getQuiz } = useQuiz();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  const handleSubmitQuiz = async (
    participant: Participant,
    selectedAnswers: Record<string, string[]>,
    openEndedAnswers: Record<string, string>,
    startTime: Date
  ) => {
    setSubmitting(true);
    try {
      const quiz = getQuiz(quizId);
      if (!quiz) {
        toast({
          title: "Erreur",
          description: "Quiz non trouvé.",
          variant: "destructive",
        });
        return;
      }

      const endTime = new Date();
      const quizResult = calculateQuizResult(participant, selectedAnswers, openEndedAnswers, startTime, quiz.questions);

      const newResultId = addResult({
        quizId: quiz.id,
        quizTitle: quiz.title,
        participant: participant,
        answers: quizResult.answers,
        totalPoints: quizResult.totalPoints,
        maxPoints: quizResult.maxPoints,
        startTime: startTime,
        endTime: endTime,
      });

      setResultId(newResultId);
      setSubmitted(true);
      toast({
        title: "Succès",
        description: "Quiz soumis avec succès!",
      });
      navigate(`/quiz-results/${quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la soumission du quiz.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateQuizResult = (
    participant: Participant, 
    selectedAnswers: Record<string, string[]>, 
    openEndedAnswers: Record<string, string>,
    startTime: Date,
    questions: Question[]
  ) => {
    let totalPoints = 0;
    let maxPoints = 0;
    const answers = questions.map(question => {
      maxPoints += question.points;
      if (question.type === 'text') {
        const answerText = openEndedAnswers[question.id] || '';
        const isCorrect = question.correctAnswer?.toLowerCase().trim() === answerText.toLowerCase().trim();
        const points = isCorrect ? question.points : 0;
        totalPoints += points;
        return {
          questionId: question.id,
          answerText: answerText,
          isCorrect: isCorrect,
          points: points
        };
      } else {
        const selectedAnswerIds = selectedAnswers[question.id] || [];
        let questionPoints = 0;
        let allCorrect = true;

        question.answers.forEach(answer => {
          const isSelected = selectedAnswerIds.includes(answer.id);
          if (answer.isCorrect) {
            if (isSelected) {
              questionPoints += answer.points;
            } else {
              allCorrect = false;
            }
          } else {
            if (isSelected) {
              allCorrect = false;
            }
          }
        });

        if (allCorrect) {
          totalPoints += question.points;
        }

        return {
          questionId: question.id,
          answerIds: selectedAnswerIds,
          isCorrect: allCorrect,
          points: allCorrect ? question.points : 0
        };
      }
    });

    return {
      answers,
      totalPoints,
      maxPoints
    };
  };

  const buildTextQuestionResult = (
    question: Question,
    openEndedAnswer: string,
  ) => {
    const isCorrect = question.correctAnswer?.toLowerCase().trim() === openEndedAnswer.toLowerCase().trim();
    return {
      questionId: question.id,
      answerText: openEndedAnswer,
      isCorrect: isCorrect,
      points: isCorrect ? question.points : 0
    };
  };

  const buildMultipleChoiceQuestionResult = (
    question: Question,
    selectedAnswerIds: string[],
  ) => {
    let questionPoints = 0;
    let allCorrect = true;

    question.answers.forEach(answer => {
      const isSelected = selectedAnswerIds.includes(answer.id);
      if (answer.isCorrect) {
        if (isSelected) {
          questionPoints += answer.points;
        } else {
          allCorrect = false;
        }
      } else {
        if (isSelected) {
          if (isSelected) {
            allCorrect = false;
          }
        }
      }
    });

    return {
      questionId: question.id,
      answerIds: selectedAnswerIds,
      isCorrect: allCorrect,
      points: allCorrect ? question.points : 0
    };
  };

  return {
    submitting,
    submitted,
    resultId,
    handleSubmitQuiz,
  };
};

export default useQuizSubmission;
