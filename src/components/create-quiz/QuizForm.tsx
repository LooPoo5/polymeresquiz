
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '@/context/QuizContext';
import { toast } from 'sonner';
import { Save, Printer, Download } from 'lucide-react';
import QuizTitleSection from './QuizTitleSection';
import QuestionsSection from './QuestionsSection';
import { Button } from '@/components/ui/button';

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
  
  const handlePrintQuiz = () => {
    window.print();
    toast.success("Impression du quiz en cours");
  };

  const handleDownloadQuiz = () => {
    try {
      const quizData = {
        title,
        imageUrl,
        questions,
      };
      
      const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-').toLowerCase() || 'quiz'}.json`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Quiz téléchargé avec succès");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du quiz");
      console.error("Download error:", error);
    }
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
      
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={handlePrintQuiz}
          className="flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <Printer size={18} />
          <span>Imprimer</span>
        </Button>
        
        <Button
          variant="outline" 
          onClick={handleDownloadQuiz}
          className="flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <Download size={18} />
          <span>Télécharger</span>
        </Button>
        
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
