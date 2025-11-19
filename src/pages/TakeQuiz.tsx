
import React from 'react';
import { useParams } from 'react-router-dom';
import QuizHeader from '@/components/quiz/QuizHeader';
import LoadingState from '@/components/quiz/LoadingState';
import QuizContainer from '@/components/quiz/QuizContainer';
import { useTakeQuiz } from '@/hooks/useTakeQuiz';
import QuizProgressBar from '@/components/quiz/QuizProgressBar';

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
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
    signatureRequired,
    setSignatureRequired,
    selectedAnswers,
    openEndedAnswers,
    handleAnswerSelect,
    handleOpenEndedAnswerChange,
    handleSubmit,
    answeredQuestionsCount
  } = useTakeQuiz(id);

  if (!quiz) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <QuizHeader 
          title={quiz.title} 
          questionCount={quiz.questions.length}
          quiz={quiz}
        />
        
        {quiz.questions.length > 0 && (
          <QuizProgressBar 
            currentQuestion={answeredQuestionsCount} 
            totalQuestions={quiz.questions.length} 
          />
        )}
        
        <QuizContainer
          quiz={quiz}
          name={name}
          setName={setName}
          date={date}
          setDate={setDate}
          instructor={instructor}
          setInstructor={setInstructor}
          signature={signature}
          setSignature={setSignature}
          signatureRequired={signatureRequired}
          setSignatureRequired={setSignatureRequired}
          selectedAnswers={selectedAnswers}
          openEndedAnswers={openEndedAnswers}
          handleAnswerSelect={handleAnswerSelect}
          handleOpenEndedAnswerChange={handleOpenEndedAnswerChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default TakeQuiz;
