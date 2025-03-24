import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useQuiz } from '@/context/QuizContext';
import { Question } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import QuizBasicInfo from '@/components/quiz-creation/QuizBasicInfo';
import QuestionsSection from '@/components/quiz-creation/QuestionsSection';
import { useQuizValidation } from '@/components/quiz-creation/QuizValidation';

const CreateQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const { createQuiz, updateQuiz, getQuiz } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      const quiz = getQuiz(id);
      if (quiz) {
        setTitle(quiz.title);
        setQuestions(quiz.questions);
        setImageUrl(quiz.imageUrl || '');
      } else {
        toast({
          title: "Quiz non trouvé",
          description: "Le quiz que vous essayez de modifier n'existe pas.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, getQuiz, navigate, toast]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl('');
  };
  
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: '',
      type: 'multiple-choice',
      points: 1,
      answers: []
    };
    setQuestions([...questions, newQuestion]);
  };
  
  const handleUpdateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };
  
  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setQuestions(items);
  };
  
  const { validateQuiz } = useQuizValidation({ title, questions });
  
  const handleSubmit = () => {
    const errors = validateQuiz();
    
    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: "Erreur",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }
    
    const quizData = {
      title,
      questions,
      imageUrl,
      createdAt: new Date()
    };
    
    if (id) {
      updateQuiz({ id, ...quizData });
      toast({
        title: "Quiz mis à jour",
        description: "Le quiz a été mis à jour avec succès.",
      });
    } else {
      createQuiz(quizData);
      toast({
        title: "Quiz créé",
        description: "Le quiz a été créé avec succès.",
      });
    }
    
    navigate('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Modifier' : 'Créer'} un Quiz</h1>
      
      <QuizBasicInfo
        title={title}
        setTitle={setTitle}
        imageUrl={imageUrl}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
      />
      
      <QuestionsSection
        questions={questions}
        handleAddQuestion={handleAddQuestion}
        handleUpdateQuestion={handleUpdateQuestion}
        handleDeleteQuestion={handleDeleteQuestion}
        handleDragEnd={handleDragEnd}
      />
      
      <button
        onClick={handleSubmit}
        className="bg-brand-red hover:bg-opacity-90 text-white px-6 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all button-hover"
      >
        {id ? 'Mettre à jour le Quiz' : 'Créer le Quiz'}
      </button>
    </div>
  );
};

export default CreateQuiz;
