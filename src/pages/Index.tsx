
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import QuizCard from '@/components/ui-components/QuizCard';
import { Plus, Search, BarChart, Star } from 'lucide-react';
import QuizPopularityChart from '@/components/charts/QuizPopularityChart';

const Index = () => {
  const { quizzes, results } = useQuiz();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChartSection, setShowChartSection] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('quiz-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quiz-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, isFavorite: boolean) => {
    if (isFavorite) {
      setFavorites([...favorites, id]);
    } else {
      setFavorites(favorites.filter(favId => favId !== id));
    }
  };
  
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteQuizzes = filteredQuizzes.filter(quiz => favorites.includes(quiz.id));
  const regularQuizzes = filteredQuizzes.filter(quiz => !favorites.includes(quiz.id));
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Liste des Quiz</h1>
          <p className="text-gray-600">Sélectionnez un quiz pour commencer</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Rechercher un quiz..." 
              className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
          <button
            onClick={() => setShowChartSection(!showChartSection)}
            className={`${showChartSection ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-90 p-2.5 rounded-lg flex items-center justify-center transition-colors`}
            title={showChartSection ? "Masquer les statistiques" : "Afficher les statistiques"}
          >
            <BarChart size={18} />
          </button>
        </div>
      </div>

      {showChartSection && results.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <QuizPopularityChart quizzes={quizzes} results={results} />
        </div>
      )}

      {filteredQuizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {searchQuery ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {favoriteQuizzes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Favoris</h2>
                <Star size={18} className="text-yellow-500" fill="currentColor" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteQuizzes.map(quiz => (
                  <QuizCard 
                    key={quiz.id} 
                    quiz={quiz} 
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div>
            {favoriteQuizzes.length > 0 && <h2 className="text-xl font-semibold mb-4">Tous les Quiz</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularQuizzes.map(quiz => (
                <QuizCard 
                  key={quiz.id} 
                  quiz={quiz} 
                  isFavorite={false}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
