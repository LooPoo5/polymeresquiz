
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizResult, Participant, Question as QuestionType } from '@/types/quiz';
import { toast } from "sonner";

export type SelectedAnswers = Record<string, string[]>;
export type OpenEndedAnswers = Record<string, string>;

export interface QuizSubmissionProps {
  quiz: any;
  selectedAnswers: SelectedAnswers;
  openEndedAnswers: OpenEndedAnswers;
  participantInfo: Participant;
}

export const useQuizSubmission = (quizId: string | undefined) => {
  const { getQuiz, addResult } = useQuiz();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructor, setInstructor] = useState('');
  const [signature, setSignature] = useState('');

  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<OpenEndedAnswers>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (quizId) {
      const quizData = getQuiz(quizId);
      if (quizData) {
        setQuiz(quizData);
      } else {
        toast.error("Quiz introuvable");
        navigate('/');
      }
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [quizId, getQuiz, navigate]);

  useEffect(() => {
    if (hasStartedQuiz && !startTime) {
      const now = new Date();
      setStartTime(now);
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [hasStartedQuiz, startTime]);

  const handleAnswerSelect = (questionId: string, answerId: string, selected: boolean) => {
    if (!hasStartedQuiz) {
      setHasStartedQuiz(true);
    }
    setSelectedAnswers(prev => {
      const current = prev[questionId] || [];

      const question = quiz.questions.find((q: QuestionType) => q.id === questionId);
      if (question) {
        if (question.type === 'multiple-choice') {
          return {
            ...prev,
            [questionId]: selected ? [answerId] : []
          };
        } else if (question.type === 'checkbox') {
          if (selected) {
            return {
              ...prev,
              [questionId]: [...current, answerId]
            };
          } else {
            return {
              ...prev,
              [questionId]: current.filter(id => id !== answerId)
            };
          }
        }
      }
      return prev;
    });
  };

  const handleOpenEndedAnswerChange = (questionId: string, answer: string) => {
    if (!hasStartedQuiz && answer.trim()) {
      setHasStartedQuiz(true);
    }
    setOpenEndedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Veuillez saisir votre nom");
      return false;
    }
    if (!instructor.trim()) {
      toast.error("Veuillez saisir le nom du formateur");
      return false;
    }
    if (!signature) {
      toast.error("Veuillez signer");
      return false;
    }
    return true;
  };

  const calculateResults = (): QuizResult => {
    const answers = quiz.questions.map((question: QuestionType) => {
      if (question.type === 'multiple-choice') {
        const userAnswers = selectedAnswers[question.id] || [];
        const selectedAnswerId = userAnswers[0];
        const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);
        const isCorrect = selectedAnswer?.isCorrect || false;
        
        return {
          questionId: question.id,
          answerId: userAnswers[0] || undefined,
          isCorrect: isCorrect,
          points: isCorrect ? (selectedAnswer?.points || 0) : 0
        };
      } else if (question.type === 'checkbox') {
        const userAnswers = selectedAnswers[question.id] || [];

        let totalPoints = 0;
        
        // Calculate points for checkbox questions by summing points from all correct selected answers
        question.answers.forEach(answer => {
          const isSelected = userAnswers.includes(answer.id);
          if (answer.isCorrect && isSelected) {
            totalPoints += answer.points || 0;
          }
        });

        // Determine if all answers are correct
        const isAllCorrect = question.answers.every(answer => {
          const isSelected = userAnswers.includes(answer.id);
          return (answer.isCorrect && isSelected) || (!answer.isCorrect && !isSelected);
        });

        return {
          questionId: question.id,
          answerIds: userAnswers,
          isCorrect: isAllCorrect,
          points: totalPoints
        };
      } else {
        const userAnswer = openEndedAnswers[question.id] || '';
        return {
          questionId: question.id,
          answerText: userAnswer,
          isCorrect: false, // For open-ended questions, no automatic grading
          points: 0 // Points will be assigned manually
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
          .reduce((answerSum, a) => answerSum + (a.points || 0), 0);
        
        return sum + correctAnswerPoints;
      }
    }, 0);

    const participantInfo: Participant = {
      name,
      date,
      instructor,
      signature
    };

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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const unansweredQuestions = quiz.questions.filter((q: QuestionType) => {
      if (q.type === 'multiple-choice' || q.type === 'checkbox') {
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
    quiz,
    elapsedTime,
    name,
    setName,
    date,
    setDate,
    instructor,
    setInstructor,
    signature,
    setSignature,
    selectedAnswers,
    openEndedAnswers,
    handleAnswerSelect,
    handleOpenEndedAnswerChange,
    handleSubmit
  };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
