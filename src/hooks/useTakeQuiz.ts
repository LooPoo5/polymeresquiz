
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz, Participant } from '@/context/QuizContext';
import { toast } from "sonner";
import { validateParticipantInfo, calculateResults } from '@/utils/quizUtils';

export const useTakeQuiz = (quizId: string | undefined) => {
  const { getQuiz, addResult } = useQuiz();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);

  // Participant information
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructor, setInstructor] = useState('');
  const [signature, setSignature] = useState('');

  // Quiz answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string, string>>({});
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

      const question = quiz.questions.find((q: any) => q.id === questionId);
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

  const handleSubmit = () => {
    const validation = validateParticipantInfo(name, instructor, signature);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const unansweredQuestions = quiz.questions.filter((q: any) => {
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

    const participantInfo: Participant = {
      name,
      date,
      instructor,
      signature
    };
    
    const results = calculateResults(quiz, selectedAnswers, openEndedAnswers, participantInfo, startTime);
    const resultId = addResult(results);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    navigate(`/quiz-results/${resultId}`);
  };

  return {
    quiz,
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
