
import React from 'react';
import BackButton from '@/components/create-quiz/BackButton';
import QuizForm from '@/components/create-quiz/QuizForm';
import { useQuizForm } from '@/components/create-quiz/useQuizForm';

const CreateQuiz = () => {
  const {
    title,
    setTitle,
    imageUrl,
    setImageUrl,
    questions,
    setQuestions,
    isEditing,
    handleSaveQuiz,
  } = useQuizForm();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BackButton />
      
      <QuizForm
        title={title}
        setTitle={setTitle}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        questions={questions}
        setQuestions={setQuestions}
        isEditing={isEditing}
        handleSaveQuiz={handleSaveQuiz}
      />
    </div>
  );
};

export default CreateQuiz;
