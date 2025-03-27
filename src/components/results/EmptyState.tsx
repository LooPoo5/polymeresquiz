
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

const EmptyState = ({ hasSearchQuery, searchQuery, onClearSearch }: EmptyStateProps) => {
  const navigate = useNavigate();

  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 mb-3">
          <Search size={48} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h2>
        <p className="text-gray-500 mb-4">Aucun résultat ne correspond à votre recherche.</p>
        <button onClick={onClearSearch} className="text-brand-red hover:underline">
          Effacer la recherche
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-400 mb-3">
        <FileText size={48} />
      </div>
      <h2 className="text-xl font-semibold mb-2">Aucun résultat</h2>
      <p className="text-gray-500 mb-4">Les résultats des quiz apparaîtront ici.</p>
      <button 
        onClick={() => navigate('/')} 
        className="bg-brand-red hover:bg-opacity-90 text-white px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all-200 button-hover"
      >
        <span>Prendre un quiz</span>
      </button>
    </div>
  );
};

export default EmptyState;
