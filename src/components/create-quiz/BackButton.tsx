
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors"
    >
      <ArrowLeft size={18} />
      <span>Retour à l'accueil</span>
    </button>
  );
};

export default BackButton;
