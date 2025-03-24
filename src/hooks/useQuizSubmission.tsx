
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { Question, Participant, Quiz } from '@/types/quiz';
import { toast } from '@/hooks/use-toast';

interface UseQuizSubmissionProps {
  quiz: Quiz | null;
  selectedAnswers: Record<string, string[]>;
  openEndedAnswers: Record<string, string>;
  participantInfo: Participant;
  startTime: Date | null;
  addResult: (result: Omit<import('@/types/quiz').QuizResult, "id">) => string;
  timerRef: React.MutableRefObject<number | null>;
}

interface UseQuizSubmission {
  submitting: boolean;
  submitted: boolean;
  resultId: string | null;
  handleSubmit: () => void;
}

const useQuizSubmission = (props: UseQuizSubmissionProps): UseQuizSubmission => {
  const { 
    quiz, 
    selectedAnswers, 
    openEndedAnswers, 
    participantInfo, 
    startTime, 
    addResult, 
    timerRef 
  } = props;
  
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!quiz || !startTime) {
      toast({
        title: "Erreur",
        description: "Données du quiz manquantes.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const endTime = new Date();
      const quizResult = calculateQuizResult(
        participantInfo, 
        selectedAnswers, 
        openEndedAnswers, 
        startTime, 
        quiz.questions
      );

      const newResultId = addResult({
        quizId: quiz.id,
        quizTitle: quiz.title,
        participant: participantInfo,
        answers: quizResult.answers,
        totalPoints: quizResult.totalPoints,
        maxPoints: quizResult.maxPoints,
        startTime: startTime,
        endTime: endTime,
      });

      // Clear the timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setResultId(newResultId);
      setSubmitted(true);
      toast({
        title: "Succès",
        description: "Quiz soumis avec succès!",
      });
      navigate(`/quiz-results/${quiz.id}`);
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
        // Fixed: Passing totalPoints as a local variable to buildTextQuestionResult
        const result = buildTextQuestionResult(question, openEndedAnswers[question.id] || '');
        if (result.isCorrect) {
          totalPoints += question.points;
        }
        return result;
      } else {
        const result = buildMultipleChoiceQuestionResult(question, selectedAnswers[question.id] || []);
        if (result.isCorrect) {
          totalPoints += question.points;
        }
        return result;
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
    const points = isCorrect ? question.points : 0;
    
    return {
      questionId: question.id,
      answerText: openEndedAnswer,
      isCorrect: isCorrect,
      points: points
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
          allCorrect = false;
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
    handleSubmit,
  };
};

export default useQuizSubmission;
