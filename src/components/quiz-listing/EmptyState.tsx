
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  
  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 mb-3">
          <Search size={48} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h2>
        <p className="text-gray-500 mb-4">Aucun quiz ne correspond à votre recherche.</p>
        <button 
          onClick={() => setSearchQuery('')} 
          className="text-brand-red hover:underline"
        >
          Effacer la recherche
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-400 mb-3">
        <span className="text-5xl">📚</span>
      </div>
      <h2 className="text-xl font-semibold mb-2">Pas encore de quiz</h2>
      <p className="text-gray-500 mb-4">Créez votre premier quiz pour commencer.</p>
      <button 
        onClick={() => navigate('/create')} 
        className="bg-brand-red hover:bg-opacity-90 text-white px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all-200 button-hover"
      >
        <Plus size={20} />
        <span>Créer un Quiz</span>
      </button>
    </div>
  );
};

export default EmptyState;
