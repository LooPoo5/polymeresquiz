
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, Participant } from '@/context/QuizContext';
import { toast } from "sonner";
import QuizHeader from '@/components/quiz/QuizHeader';
import ParticipantForm from '@/components/quiz/ParticipantForm';
import SignatureSection from '@/components/quiz/SignatureSection';
import QuestionsList from '@/components/quiz/QuestionsList';
import QuizFooter from '@/components/quiz/QuizFooter';
import { validateParticipantInfo, calculateResults } from '@/utils/quizUtils';

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
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
    if (id) {
      const quizData = getQuiz(id);
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
  }, [id, getQuiz, navigate]);

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

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md mb-6 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <QuizHeader title={quiz.title} questionCount={quiz.questions.length} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mx-0">
            {hasStartedQuiz && <div className="flex items-center gap-1"></div>}
            <div>{quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}</div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 my-6"></div>
        
        <ParticipantForm
          name={name}
          setName={setName}
          date={date}
          setDate={setDate}
          instructor={instructor}
          setInstructor={setInstructor}
          signature={signature}
          setSignature={setSignature}
        />
        
        <QuestionsList 
          questions={quiz.questions}
          selectedAnswers={selectedAnswers}
          openEndedAnswers={openEndedAnswers}
          handleAnswerSelect={handleAnswerSelect}
          handleOpenEndedAnswerChange={handleOpenEndedAnswerChange}
        />
        
        <SignatureSection 
          signature={signature}
          setSignature={setSignature}
        />
        
        <QuizFooter 
          questions={quiz.questions}
          selectedAnswers={selectedAnswers}
          openEndedAnswers={openEndedAnswers}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default TakeQuiz;
