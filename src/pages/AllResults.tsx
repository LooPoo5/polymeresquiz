
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { toast } from "sonner";
import { Calendar as CalendarIcon, Download, Filter, ChevronDown } from 'lucide-react';

// Import components
import SearchBar from '@/components/results/SearchBar';
import ResultsTable from '@/components/results/ResultsTable';
import EmptyState from '@/components/results/EmptyState';
import ParticipantList from '@/components/results/ParticipantList';
import PerformanceSummary from '@/components/results/PerformanceSummary';
import PerformanceTrendChart from '@/components/results/PerformanceTrendChart';

// Import UI components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const AllResults = () => {
  const { results, quizzes, deleteResult } = useQuiz();
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState(results);
  const [sortField, setSortField] = useState<string>('endTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [uniqueParticipants, setUniqueParticipants] = useState<string[]>([]);
  const [uniqueInstructors, setUniqueInstructors] = useState<string[]>([]);
  const [uniqueQuizzes, setUniqueQuizzes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'dashboard'>('table');
  
  // Advanced filters
  const [fromDate, setFromDate] = useState<Date | undefined>(subDays(new Date(), 30)); // Last 30 days by default
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [filterInstructor, setFilterInstructor] = useState<string>('all');
  const [filterQuiz, setFilterQuiz] = useState<string>('all');
  const [filterScore, setFilterScore] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Export options
  const exportFormats = [
    { label: 'Excel (.xlsx)', value: 'excel' },
    { label: 'CSV (.csv)', value: 'csv' },
    { label: 'PDF (.pdf)', value: 'pdf' }
  ];

  useEffect(() => {
    // Extract unique participants
    const participantNames = Array.from(new Set(results.map(r => r.participant.name)));
    setUniqueParticipants(participantNames);
    
    // Extract unique instructors
    const instructorNames = Array.from(new Set(results.map(r => r.participant.instructor)));
    setUniqueInstructors(instructorNames);
    
    // Extract unique quiz titles
    const quizTitles = Array.from(new Set(results.map(r => r.quizTitle)));
    setUniqueQuizzes(quizTitles);
    
    // Initialize filtered results
    applyFilters();
  }, [results]);
  
  useEffect(() => {
    applyFilters();
  }, [searchQuery, fromDate, toDate, filterInstructor, filterQuiz, filterScore]);

  const applyFilters = () => {
    let filtered = [...results];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(result => 
        result.quizTitle.toLowerCase().includes(query) || 
        result.participant.name.toLowerCase().includes(query) || 
        result.participant.instructor.toLowerCase().includes(query)
      );
    }
    
    // Apply date range filter
    if (fromDate) {
      filtered = filtered.filter(result => isAfter(result.endTime, fromDate));
    }
    
    if (toDate) {
      filtered = filtered.filter(result => isBefore(result.endTime, toDate));
    }
    
    // Apply instructor filter
    if (filterInstructor !== 'all') {
      filtered = filtered.filter(result => result.participant.instructor === filterInstructor);
    }
    
    // Apply quiz filter
    if (filterQuiz !== 'all') {
      filtered = filtered.filter(result => result.quizTitle === filterQuiz);
    }
    
    // Apply score filter
    if (filterScore !== 'all') {
      const scoreOn20 = (result: typeof filtered[0]) => Math.round((result.totalPoints / result.maxPoints) * 20);
      
      switch (filterScore) {
        case 'excellent':
          filtered = filtered.filter(result => scoreOn20(result) >= 16);
          break;
        case 'good':
          filtered = filtered.filter(result => scoreOn20(result) >= 12 && scoreOn20(result) < 16);
          break;
        case 'average':
          filtered = filtered.filter(result => scoreOn20(result) >= 10 && scoreOn20(result) < 12);
          break;
        case 'poor':
          filtered = filtered.filter(result => scoreOn20(result) < 10);
          break;
      }
    }
    
    setFilteredResults(filtered);
  };

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
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
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
  
  const resetFilters = () => {
    setFromDate(subDays(new Date(), 30));
    setToDate(new Date());
    setFilterInstructor('all');
    setFilterQuiz('all');
    setFilterScore('all');
    toast.success("Filtres réinitialisés");
  };
  
  // Calculate summary stats
  const totalQuizzes = uniqueQuizzes.length;
  const totalParticipants = uniqueParticipants.length;
  const averageScore = results.length > 0 
    ? Math.round((results.reduce((sum, r) => sum + (r.totalPoints / r.maxPoints * 20), 0) / results.length) * 10) / 10
    : 0;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Résultats</h1>
          <p className="text-gray-600">Historique et analyse des résultats de quiz</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-md border border-gray-200 overflow-hidden">
            <button 
              onClick={() => setViewMode('table')} 
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'table' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Tableau
            </button>
            <button 
              onClick={() => setViewMode('dashboard')} 
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'dashboard' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Tableau de bord
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={14} />
            Filtres
            <ChevronDown size={14} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download size={14} />
                Exporter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="flex flex-col gap-1">
                {exportFormats.map((format) => (
                  <Button 
                    key={format.value} 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start" 
                    onClick={() => handleExport(format.value)}
                  >
                    {format.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filtres avancés</h3>
            <Button variant="link" size="sm" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date range filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Plage de dates</label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left text-sm h-9",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>Date de début</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <span className="text-gray-400">→</span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left text-sm h-9",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "dd/MM/yyyy") : <span>Date de fin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Instructor filter */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Instructeur</label>
              <Select 
                value={filterInstructor} 
                onValueChange={setFilterInstructor}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les instructeurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les instructeurs</SelectItem>
                  {uniqueInstructors.map((instructor) => (
                    <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Quiz filter */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Quiz</label>
              <Select 
                value={filterQuiz} 
                onValueChange={setFilterQuiz}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les quiz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les quiz</SelectItem>
                  {uniqueQuizzes.map((quiz) => (
                    <SelectItem key={quiz} value={quiz}>{quiz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Score filter */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Performance</label>
              <Select 
                value={filterScore} 
                onValueChange={setFilterScore}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les scores</SelectItem>
                  <SelectItem value="excellent">Excellent (≥ 16/20)</SelectItem>
                  <SelectItem value="good">Bon (12-15/20)</SelectItem>
                  <SelectItem value="average">Moyen (10-11/20)</SelectItem>
                  <SelectItem value="poor">Insuffisant (< 10/20)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics Dashboard */}
      {viewMode === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <PerformanceSummary 
              title="Quiz complétés"
              value={filteredResults.length}
              total={results.length}
              icon="CopyCheck"
            />
            <PerformanceSummary 
              title="Score moyen"
              value={averageScore}
              suffix="/20"
              icon="Award"
              color={averageScore >= 12 ? 'green' : averageScore >= 10 ? 'orange' : 'red'}
            />
            <PerformanceSummary 
              title="Participants"
              value={uniqueParticipants.length}
              icon="Users"
            />
          </div>
          
          <PerformanceTrendChart 
            results={results} 
            className="mb-6" 
          />
        </>
      )}
      
      <SearchBar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />
      
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
