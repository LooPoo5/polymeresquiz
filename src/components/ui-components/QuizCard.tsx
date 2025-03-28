
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '@/context/QuizContext';
import { Calendar, FileEdit, HelpCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuizCardProps {
  quiz: Quiz;
  onEdit?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onEdit,
  isFavorite = false,
  onToggleFavorite
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleTakeQuiz = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/edit/${quiz.id}`);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(quiz.id, !isFavorite);
      toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
    }
  };

  // Format date
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(quiz.createdAt);

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer hover:scale-105" 
      onClick={handleTakeQuiz}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        {quiz.imageUrl ? (
          <img 
            src={quiz.imageUrl} 
            alt={quiz.title} 
            className="h-full w-full transition-transform duration-300 group-hover:scale-105 object-cover" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-brand-lightgray">
            <span className="text-gray-400">Pas d'image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={handleToggleFavorite} 
            className={`p-2 ${isFavorite ? 'bg-yellow-100 text-yellow-500' : 'bg-white/90 text-gray-400'} backdrop-blur-sm rounded-full shadow-sm opacity-0 transform translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-yellow-100 hover:text-yellow-500`}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleEdit}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 transform translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-brand-red hover:text-white"
            aria-label="Edit Quiz"
          >
            <FileEdit size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{quiz.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <HelpCircle size={14} />
            <span className="font-normal">{quiz.questions.length} questions</span>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-red transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
    </div>
  );
};

export default QuizCard;
