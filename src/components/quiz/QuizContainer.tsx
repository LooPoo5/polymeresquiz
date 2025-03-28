
import React from 'react';
import QuizHeader from '@/components/quiz/QuizHeader';
import ParticipantForm from '@/components/quiz/ParticipantForm';
import SignatureSection from '@/components/quiz/SignatureSection';
import QuestionsList from '@/components/quiz/QuestionsList';
import QuizFooter from '@/components/quiz/QuizFooter';
import { Quiz, Question } from '@/context/QuizContext';

interface QuizContainerProps {
  quiz: {
    id: string;
    title: string;
    questions: Question[];
  };
  name: string;
  setName: (name: string) => void;
  date: string;
  setDate: (date: string) => void;
  instructor: string;
  setInstructor: (instructor: string) => void;
  signature: string;
  setSignature: (signature: string) => void;
  selectedAnswers: Record<string, string[]>;
  openEndedAnswers: Record<string, string>;
  handleAnswerSelect: (questionId: string, answerId: string, selected: boolean) => void;
  handleOpenEndedAnswerChange: (questionId: string, answer: string) => void;
  handleSubmit: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
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
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1 dark:text-white">{quiz.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mx-0">
          <div>{quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}</div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-700 my-6"></div>
      
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
  );
};

export default QuizContainer;
