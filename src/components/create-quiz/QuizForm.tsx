
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '@/context/QuizContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import QuizTitleSection from './QuizTitleSection';
import QuestionsSection from './QuestionsSection';

type QuizFormProps = {
  title: string;
  setTitle: (title: string) => void;
  imageUrl: string;
  setImageUrl: (imageUrl: string) => void;
  questions: Quiz['questions'];
  setQuestions: (questions: Quiz['questions']) => void;
  isEditing: boolean;
  handleSaveQuiz: () => void;
};

const QuizForm: React.FC<QuizFormProps> = ({
  title,
  setTitle,
  imageUrl,
  setImageUrl,
  questions,
  setQuestions,
  isEditing,
  handleSaveQuiz,
}) => {
  const navigate = useNavigate();
  
  const handleAddQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: '',
      type: 'multiple-choice' as const,
      points: 1,
      answers: [],
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const handleUpdateQuestion = (index: number, updatedQuestion: Quiz['questions'][0]) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };
  
  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Modifier le quiz' : 'Créer un nouveau quiz'}
      </h1>
      
      <QuizTitleSection
        title={title}
        setTitle={setTitle}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />
      
      <QuestionsSection
        questions={questions}
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={handleUpdateQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        setQuestions={setQuestions}
      />
      
      <div className="flex justify-end">
        <button
          onClick={handleSaveQuiz}
          className="bg-brand-red text-white px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-opacity-90 button-hover"
        >
          <Save size={18} />
          <span>{isEditing ? 'Mettre à jour le quiz' : 'Enregistrer le quiz'}</span>
        </button>
      </div>
    </div>
  );
};

export default QuizForm;
