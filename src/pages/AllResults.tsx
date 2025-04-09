
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
import EmptyState from '@/components/results/EmptyState';
import ResultsTable from '@/components/results/ResultsTable';
import ParticipantList from '@/components/results/ParticipantList';

const AllResults = () => {
  const { results, deleteResult } = useQuiz();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'dashboard'>('table');
  
  // Add empty export formats array for PageHeader prop
  const exportFormats = [];

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
  
  // Add empty handleExport function for PageHeader prop
  const handleExport = () => {};
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <PageHeader 
          viewMode={viewMode}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          setViewMode={setViewMode}
          exportFormats={exportFormats}
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
