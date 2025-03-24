
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuizSubmission } from '@/hooks/useQuizSubmission';
import ParticipantForm from '@/components/quiz/ParticipantForm';
import QuestionList from '@/components/quiz/QuestionList';
import SignatureSection from '@/components/quiz/SignatureSection';
import SubmitQuizSection from '@/components/quiz/SubmitQuizSection';

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
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
  } = useQuizSubmission(id);

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
        
        <QuestionList
          questions={quiz.questions}
          selectedAnswers={selectedAnswers}
          openEndedAnswers={openEndedAnswers}
          onAnswerSelect={handleAnswerSelect}
          onOpenEndedAnswerChange={handleOpenEndedAnswerChange}
        />
        
        <SignatureSection
          signature={signature}
          setSignature={setSignature}
        />
        
        <SubmitQuizSection
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
