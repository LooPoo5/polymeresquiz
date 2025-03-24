
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import refactored components
import QuizTimer from '@/components/quiz-taking/QuizTimer';
import ParticipantForm from '@/components/quiz-taking/ParticipantForm';
import QuizQuestions from '@/components/quiz-taking/QuizQuestions';
import QuizSubmit from '@/components/quiz-taking/QuizSubmit';

// Import custom hooks
import useQuizAnswers from '@/hooks/useQuizAnswers';
import useQuizSubmission from '@/hooks/useQuizSubmission';

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const { getQuiz, addResult } = useQuiz();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructor, setInstructor] = useState('');
  const [signature, setSignature] = useState('');
  
  const timerRef = useRef<number | null>(null);
  
  const {
    selectedAnswers,
    openEndedAnswers,
    hasStartedQuiz,
    handleAnswerSelect,
    handleOpenEndedAnswerChange
  } = useQuizAnswers();
  
  const participantInfo = {
    name,
    date,
    instructor,
    signature
  };
  
  const {
    handleSubmit
  } = useQuizSubmission({
    quiz,
    selectedAnswers,
    openEndedAnswers,
    participantInfo,
    startTime,
    addResult,
    timerRef
  });

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
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Retour à l'accueil</span>
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mx-0">
            {hasStartedQuiz && (
              <QuizTimer
                elapsedTime={elapsedTime}
                timerRef={timerRef}
                setElapsedTime={setElapsedTime}
                hasStartedQuiz={hasStartedQuiz}
                startTime={startTime}
                setStartTime={setStartTime}
              />
            )}
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
        
        <QuizQuestions
          questions={quiz.questions}
          selectedAnswers={selectedAnswers}
          openEndedAnswers={openEndedAnswers}
          handleAnswerSelect={handleAnswerSelect}
          handleOpenEndedAnswerChange={handleOpenEndedAnswerChange}
        />
        
        <QuizSubmit
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
