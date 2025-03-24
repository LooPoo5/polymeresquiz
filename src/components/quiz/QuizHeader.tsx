
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type QuizHeaderProps = {
  title: string;
  questionCount: number;
};

const QuizHeader: React.FC<QuizHeaderProps> = ({ title, questionCount }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Retour à l'accueil</span>
      </button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mx-0">
          <div>{questionCount} question{questionCount > 1 ? 's' : ''}</div>
        </div>
      </div>
    </>
  );
};

export default QuizHeader;
