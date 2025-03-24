
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QuizResult, Participant, Question } from '@/types/quiz';

interface UseQuizSubmissionProps {
  quiz: {
    id: string;
    title: string;
    questions: Question[];
  };
  selectedAnswers: Record<string, string[]>;
  openEndedAnswers: Record<string, string>;
  participantInfo: {
    name: string;
    date: string;
    instructor: string;
    signature: string;
  };
  startTime: Date | null;
  addResult: (result: Omit<QuizResult, 'id'>) => string;
  timerRef: React.MutableRefObject<number | null>;
}

const useQuizSubmission = ({
  quiz,
  selectedAnswers,
  openEndedAnswers,
  participantInfo,
  startTime,
  addResult,
  timerRef
}: UseQuizSubmissionProps) => {
  const navigate = useNavigate();
  
  const validateForm = () => {
    if (!participantInfo.name.trim()) {
      toast.error("Veuillez saisir votre nom");
      return false;
    }
    if (!participantInfo.instructor.trim()) {
      toast.error("Veuillez saisir le nom du formateur");
      return false;
    }
    if (!participantInfo.signature) {
      toast.error("Veuillez signer");
      return false;
    }
    return true;
  };

  const calculateResults = (): QuizResult => {
    const answers = quiz.questions.map((question: QuestionType) => {
      if (question.type === 'multiple-choice' || question.type === 'satisfaction') {
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
      if (q.type === 'text') {
        return sum + q.points;
      } else {
        const correctAnswerPoints = q.answers
          .filter(a => a.isCorrect)
          .reduce((answerSum, a) => answerSum + (a.points || 1), 0);
        
        return sum + correctAnswerPoints;
      }
    }, 0);

    const participantData: Participant = {
      name: participantInfo.name,
      date: participantInfo.date,
      instructor: participantInfo.instructor,
      signature: participantInfo.signature
    };

    return {
      id: '',
      quizId: quiz.id,
      quizTitle: quiz.title,
      participant: participantData,
      answers,
      totalPoints,
      maxPoints,
      startTime: startTime || new Date(),
      endTime: new Date()
    };
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const unansweredQuestions = quiz.questions.filter((q: QuestionType) => {
      if (q.type === 'multiple-choice' || q.type === 'checkbox' || q.type === 'satisfaction') {
        return !selectedAnswers[q.id] || selectedAnswers[q.id].length === 0;
      } else {
        return !openEndedAnswers[q.id] || openEndedAnswers[q.id].trim() === '';
      }
    });
    
    if (unansweredQuestions.length > 0) {
      const isConfirmed = window.confirm(`Il y a ${unansweredQuestions.length} question(s) sans réponse. Voulez-vous continuer quand même?`);
      if (!isConfirmed) {
        return;
      }
    }
    
    const results = calculateResults();
    const resultId = addResult(results);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    navigate(`/quiz-results/${resultId}`);
  };

  return {
    validateForm,
    calculateResults,
    handleSubmit
  };
};

export default useQuizSubmission;
