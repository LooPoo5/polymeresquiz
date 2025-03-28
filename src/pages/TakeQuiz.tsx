
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizHeader from '@/components/quiz/QuizHeader';
import LoadingState from '@/components/quiz/LoadingState';
import QuizContainer from '@/components/quiz/QuizContainer';
import { useTakeQuiz } from '@/hooks/useTakeQuiz';
import DarkModeToggle from '@/components/ui-components/DarkModeToggle';
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
    selectedAnswers,
    openEndedAnswers,
    handleAnswerSelect,
    handleOpenEndedAnswerChange,
    handleSubmit
  } = useTakeQuiz(id);
  
  // Track current question for progress bar
  const [currentQuestion, setCurrentQuestion] = useState(1);
  
  // Update current question based on answered questions
  useEffect(() => {
    if (!quiz) return;
    
    let lastAnsweredQuestion = 0;
    
    quiz.questions.forEach((question, index) => {
      const questionId = question.id;
      const hasAnswer = 
        (question.type === 'multiple-choice' || question.type === 'checkbox') 
          ? selectedAnswers[questionId]?.length > 0
          : openEndedAnswers[questionId]?.trim().length > 0;
          
      if (hasAnswer) {
        lastAnsweredQuestion = index + 1;
      }
    });
    
    setCurrentQuestion(lastAnsweredQuestion === 0 ? 1 : lastAnsweredQuestion);
  }, [quiz, selectedAnswers, openEndedAnswers]);

  if (!quiz) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <QuizHeader title={quiz.title} questionCount={quiz.questions.length} />
          <DarkModeToggle />
        </div>
        
        {quiz.questions.length > 0 && (
          <QuizProgressBar 
            currentQuestion={currentQuestion} 
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
