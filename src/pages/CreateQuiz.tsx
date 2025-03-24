
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { Quiz, Question } from '@/types/quiz';
import { toast } from "sonner";
import { Save, ArrowLeft } from 'lucide-react';
import QuizBasicInfo from '@/components/quiz-creation/QuizBasicInfo';
import QuestionsSection from '@/components/quiz-creation/QuestionsSection';
import QuizValidation from '@/components/quiz-creation/QuizValidation';

const CreateQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const { createQuiz, updateQuiz, getQuiz } = useQuiz();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (id) {
      const quiz = getQuiz(id);
      if (quiz) {
        setTitle(quiz.title);
        setImageUrl(quiz.imageUrl || '');
        setQuestions(quiz.questions.map(q => {
          if (q.answers) {
            q.answers = q.answers.map(a => ({
              ...a,
              points: a.points || (a.isCorrect ? 1 : 0)
            }));
          }
          return q;
        }));
        setIsEditing(true);
      } else {
        toast.error("Quiz introuvable");
        navigate('/');
      }
    } else {
      if (questions.length === 0) {
        handleAddQuestion();
      }
    }
  }, [id, getQuiz, navigate]);
  
  const handleAddQuestion = () => {
    const newQuestion: QuestionType = {
      id: `question-${Date.now()}`,
      text: '',
      type: 'multiple-choice',
      points: 1,
      answers: [],
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const handleUpdateQuestion = (index: number, updatedQuestion: QuestionType) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };
  
  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setQuestions(items);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      
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
  
  const handleSaveQuiz = () => {
    const { validateQuiz } = QuizValidation({ title, questions });
    const errors = validateQuiz();
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }
    
    const quizData: Omit<Quiz, 'id' | 'createdAt'> = {
      title,
      imageUrl: imageUrl || undefined,
      questions,
    };
    
    if (isEditing && id) {
      updateQuiz({
        id,
        ...quizData,
        createdAt: getQuiz(id)?.createdAt || new Date(),
      });
      toast.success("Quiz mis à jour avec succès");
    } else {
      createQuiz(quizData);
      toast.success("Quiz créé avec succès");
    }
    
    navigate('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Retour à l'accueil</span>
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Modifier le quiz' : 'Créer un nouveau quiz'}
        </h1>
        
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
    </div>
  );
};

export default CreateQuiz;
