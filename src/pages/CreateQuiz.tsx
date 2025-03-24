
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, Quiz, Question as QuestionType } from '@/context/QuizContext';
import QuestionWithImage from '@/components/ui-components/QuestionWithImage';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from "sonner";
import { Upload, Trash2, Save, Plus, AlertCircle, ArrowLeft } from 'lucide-react';

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
        
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre du quiz *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre du quiz"
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image (optionnel)
          </label>
          
          {imageUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[200px] w-full">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-brand-red p-1.5 rounded-full shadow-sm hover:bg-brand-red hover:text-white transition-colors"
                aria-label="Remove image"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">
                  Glissez-déposez une image ou cliquez pour parcourir
                </p>
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  <span>Parcourir</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <AlertCircle size={14} />
              <span>Attribuez des points à chaque réponse correcte</span>
            </div>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {questions.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <QuestionWithImage
                            question={question}
                            onChange={(updatedQuestion) =>
                              handleUpdateQuestion(index, updatedQuestion)
                            }
                            onDelete={() => handleDeleteQuestion(index)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <button
            onClick={handleAddQuestion}
            className="mt-4 w-full border-2 border-dashed border-gray-200 py-3 flex items-center justify-center rounded-lg text-gray-500 hover:text-brand-red hover:border-brand-red transition-colors"
          >
            <Plus size={20} className="mr-2" />
            <span>Ajouter une question</span>
          </button>
        </div>
        
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
