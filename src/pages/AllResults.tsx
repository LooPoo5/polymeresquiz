import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { toast } from "sonner";
import { Search, FileText, Calendar, Trash2, Eye, Download, FilterX } from 'lucide-react';
const AllResults = () => {
  const {
    results,
    deleteResult
  } = useQuiz();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState(results);

  // Sort results by date (newest first)
  const sortedResults = [...filteredResults].sort((a, b) => b.endTime.getTime() - a.endTime.getTime());
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) {
      setFilteredResults(results);
      return;
    }
    const filtered = results.filter(result => result.quizTitle.toLowerCase().includes(query) || result.participant.name.toLowerCase().includes(query) || result.participant.instructor.toLowerCase().includes(query));
    setFilteredResults(filtered);
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredResults(results);
  };
  const handleViewResult = (id: string) => {
    navigate(`/quiz-results/${id}`);
  };
  const handleDeleteResult = (id: string) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce résultat ? Cette action est irréversible.");
    if (isConfirmed) {
      deleteResult(id);
      toast.success("Résultat supprimé avec succès");

      // Update filtered results
      setFilteredResults(prev => prev.filter(r => r.id !== id));
    }
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  return <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Résultats</h1>
          <p className="text-gray-600">Historique des résultats</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Rechercher un résultat..." className="pl-10 pr-10 py-2.5 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" value={searchQuery} onChange={handleSearch} />
          {searchQuery && <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
              <FilterX size={18} />
            </button>}
        </div>
      </div>
      
      {sortedResults.length === 0 ? <div className="flex flex-col items-center justify-center py-16 text-center">
          {searchQuery ? <>
              <div className="text-gray-400 mb-3">
                <Search size={48} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h2>
              <p className="text-gray-500 mb-4">Aucun résultat ne correspond à votre recherche.</p>
              <button onClick={handleClearSearch} className="text-brand-red hover:underline">
                Effacer la recherche
              </button>
            </> : <>
              <div className="text-gray-400 mb-3">
                <FileText size={48} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Aucun résultat</h2>
              <p className="text-gray-500 mb-4">Les résultats des quiz apparaîtront ici.</p>
              <button onClick={() => navigate('/')} className="bg-brand-red hover:bg-opacity-90 text-white px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all-200 button-hover">
                <span>Choisir un quiz</span>
              </button>
            </>}
        </div> : <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedResults.map(result => {
            const scoreOn20 = Math.round(result.totalPoints / result.maxPoints * 20);
            return <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        {formatDate(result.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.quizTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.participant.name}</div>
                      <div className="text-sm text-gray-500">Formateur: {result.participant.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${scoreOn20 >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                        {scoreOn20}/20
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.totalPoints}/{result.maxPoints} points
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={() => handleViewResult(result.id)} className="text-brand-red hover:text-opacity-80 transition-colors p-1" title="Voir le détail">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleDeleteResult(result.id)} className="text-gray-400 hover:text-brand-red transition-colors p-1" title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>;
          })}
            </tbody>
          </table>
        </div>}
    </div>;
};
export default AllResults;