
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { toast } from "sonner";

import SearchBar from '@/components/results/SearchBar';
import ResultsTable from '@/components/results/ResultsTable';
import EmptyState from '@/components/results/EmptyState';
import ParticipantList from '@/components/results/ParticipantList';

const AllResults = () => {
  const { results, deleteResult } = useQuiz();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState(results);
  const [sortField, setSortField] = useState<string>('endTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [uniqueParticipants, setUniqueParticipants] = useState<string[]>([]);

  useEffect(() => {
    const participantNames = Array.from(new Set(results.map(r => r.participant.name)));
    setUniqueParticipants(participantNames);
    setFilteredResults(results);
  }, [results]);

  const sortedResults = [...filteredResults].sort((a, b) => {
    let compareValueA;
    let compareValueB;

    switch (sortField) {
      case 'endTime':
        compareValueA = a.endTime.getTime();
        compareValueB = b.endTime.getTime();
        break;
      case 'quizTitle':
        compareValueA = a.quizTitle.toLowerCase();
        compareValueB = b.quizTitle.toLowerCase();
        break;
      case 'participantName':
        compareValueA = a.participant.name.toLowerCase();
        compareValueB = b.participant.name.toLowerCase();
        break;
      case 'score':
        compareValueA = a.totalPoints / a.maxPoints;
        compareValueB = b.totalPoints / b.maxPoints;
        break;
      default:
        compareValueA = a.endTime.getTime();
        compareValueB = b.endTime.getTime();
    }

    if (sortDirection === 'asc') {
      return compareValueA > compareValueB ? 1 : -1;
    } else {
      return compareValueA < compareValueB ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) {
      setFilteredResults(results);
      return;
    }
    const filtered = results.filter(result => 
      result.quizTitle.toLowerCase().includes(query) || 
      result.participant.name.toLowerCase().includes(query) || 
      result.participant.instructor.toLowerCase().includes(query)
    );
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
      setFilteredResults(prev => prev.filter(r => r.id !== id));
    }
  };
  
  const handleViewParticipantStats = (participantName: string) => {
    navigate(`/participant-stats/${encodeURIComponent(participantName)}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Résultats</h1>
          <p className="text-gray-600">Historique des résultats</p>
        </div>
        
        <SearchBar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />
      </div>
      
      <ParticipantList
        participants={uniqueParticipants}
        onViewParticipantStats={handleViewParticipantStats}
      />
      
      {sortedResults.length === 0 ? (
        <EmptyState
          hasSearchQuery={!!searchQuery}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />
      ) : (
        <ResultsTable
          results={sortedResults}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onDeleteResult={handleDeleteResult}
          onViewResult={handleViewResult}
          onViewParticipantStats={handleViewParticipantStats}
        />
      )}
    </div>
  );
};

export default AllResults;
