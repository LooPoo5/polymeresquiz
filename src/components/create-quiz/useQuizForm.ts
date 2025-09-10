
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, Quiz, Question as QuestionType } from '@/context/QuizContext';
import { toast } from 'sonner';

export const useQuizForm = () => {
  const { id } = useParams<{ id: string }>();
  const { createQuiz, updateQuiz, getQuiz, deleteQuiz } = useQuiz();
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
      answers: [{
        id: `answer-${Date.now()}`,
        text: '',
        isCorrect: false,
        points: 0
      }],
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const handleSaveQuiz = () => {
    if (!title.trim()) {
      toast.error("Veuillez saisir un titre pour le quiz");
      return;
    }
    
    if (questions.length === 0) {
      toast.error("Ajoutez au moins une question");
      return;
    }
    
    const hasEmptyQuestion = questions.some((q) => !q.text.trim());
    if (hasEmptyQuestion) {
      toast.error("Toutes les questions doivent avoir un texte");
      return;
    }
    
    const hasInvalidMultipleChoice = questions.some(
      (q) => (q.type === 'multiple-choice' || q.type === 'checkbox') && q.answers.length < 2
    );
    if (hasInvalidMultipleChoice) {
      toast.error("Les questions à choix doivent avoir au moins 2 réponses");
      return;
    }
    
    const hasNoCorrectAnswer = questions.some(
      (q) => (q.type === 'multiple-choice' || q.type === 'checkbox') && 
             !q.answers.some(a => a.isCorrect)
    );
    if (hasNoCorrectAnswer) {
      toast.error("Chaque question à choix doit avoir au moins une réponse correcte");
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

  const handleDeleteQuiz = () => {
    if (!id || !isEditing) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.")) {
      deleteQuiz(id);
      toast.success("Quiz supprimé avec succès");
      navigate('/');
    }
  };
  
  return {
    title,
    setTitle,
    imageUrl,
    setImageUrl,
    questions,
    setQuestions,
    isEditing,
    handleSaveQuiz,
    handleDeleteQuiz,
  };
};
