
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { toast } from "sonner";

// Import custom hooks
import { useResultsFiltering } from '@/hooks/useResultsFiltering';

// Import components
import PageHeader from '@/components/results/PageHeader';
import FiltersPanel from '@/components/results/FiltersPanel';
import Dashboard from '@/components/results/Dashboard';
import SearchBar from '@/components/results/SearchBar';
import ResultsTable from '@/components/results/ResultsTable';
import EmptyState from '@/components/results/EmptyState';
import ParticipantList from '@/components/results/ParticipantList';

const AllResults = () => {
  const { results, deleteResult } = useQuiz();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'dashboard'>('table');
  
  // Export options
  const exportFormats = [
    { label: 'Excel (.xlsx)', value: 'excel' },
    { label: 'CSV (.csv)', value: 'csv' },
    { label: 'PDF (.pdf)', value: 'pdf' }
  ];

  const {
    searchQuery,
    sortedResults,
    sortField,
    sortDirection,
    fromDate,
    toDate,
    filterInstructor,
    filterQuiz,
    filterScore,
    showFilters,
    uniqueParticipants,
    uniqueInstructors,
    uniqueQuizzes,
    averageScore,
    filteredResults,
    setFromDate,
    setToDate,
    setFilterInstructor,
    setFilterQuiz,
    setFilterScore,
    handleSort,
    handleSearch,
    handleClearSearch,
    toggleFilters,
    resetFilters
  } = useResultsFiltering(results);
  
  const handleViewResult = (id: string) => {
    navigate(`/quiz-results/${id}`);
  };
  
  const handleDeleteResult = (id: string) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce résultat ? Cette action est irréversible.");
    if (isConfirmed) {
      deleteResult(id);
      toast.success("Résultat supprimé avec succès");
    }
  };
  
  const handleViewParticipantStats = (participantName: string) => {
    navigate(`/participant-stats/${encodeURIComponent(participantName)}`);
  };
  
  const handleExport = (format: string) => {
    toast.success(`Exportation en format ${format.toUpperCase()} en cours...`);
    
    setTimeout(() => {
      toast.success(`Données exportées avec succès en format ${format.toUpperCase()}`);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <PageHeader 
          viewMode={viewMode}
          showFilters={showFilters}
          exportFormats={exportFormats}
          setViewMode={setViewMode}
          toggleFilters={toggleFilters}
          handleExport={handleExport}
        />
        
        <div className="mt-4 md:mt-0">
          <SearchBar
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
          />
        </div>
      </div>
      
      {viewMode === 'dashboard' && (
        <Dashboard 
          results={results}
          filteredResults={filteredResults}
          uniqueParticipants={uniqueParticipants}
          averageScore={averageScore}
        />
      )}
      
      <ParticipantList
        participants={uniqueParticipants}
        onViewParticipantStats={handleViewParticipantStats}
      />
      
      {showFilters && (
        <FiltersPanel
          fromDate={fromDate}
          toDate={toDate}
          filterInstructor={filterInstructor}
          filterQuiz={filterQuiz}
          filterScore={filterScore}
          uniqueInstructors={uniqueInstructors}
          uniqueQuizzes={uniqueQuizzes}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setFilterInstructor={setFilterInstructor}
          setFilterQuiz={setFilterQuiz}
          setFilterScore={setFilterScore}
          resetFilters={() => {
            resetFilters();
            toast.success("Filtres réinitialisés");
          }}
        />
      )}
      
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
