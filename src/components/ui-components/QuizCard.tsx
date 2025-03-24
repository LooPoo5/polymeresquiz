import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { Clock, Eye, Pencil, Trash2 } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();
  const { deleteQuiz } = useQuiz();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.");
    if (isConfirmed) {
      deleteQuiz(id);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/quiz/${quiz.id}`)}
    >
      {quiz.imageUrl && (
        <img src={quiz.imageUrl} alt={quiz.title} className="w-full h-40 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{quiz.title}</h3>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <Clock size={16} className="shrink-0" />
          <span>{quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${quiz.id}`);
            }}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => handleDelete(e, quiz.id)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/quiz/${quiz.id}`);
            }}
            className="p-2 rounded-md text-brand-red hover:bg-red-50 hover:text-brand-red transition-colors"
            aria-label="Take Quiz"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
