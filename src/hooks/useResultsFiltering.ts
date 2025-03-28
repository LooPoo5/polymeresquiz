
import { useState, useEffect } from 'react';
import { QuizResult } from '@/context/types';
import { isAfter, isBefore, subDays } from 'date-fns';

type SortField = 'endTime' | 'quizTitle' | 'participantName' | 'score';
type SortDirection = 'asc' | 'desc';

export const useResultsFiltering = (results: QuizResult[]) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<QuizResult[]>(results);
  const [sortField, setSortField] = useState<SortField>('endTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [uniqueParticipants, setUniqueParticipants] = useState<string[]>([]);
  const [uniqueInstructors, setUniqueInstructors] = useState<string[]>([]);
  const [uniqueQuizzes, setUniqueQuizzes] = useState<string[]>([]);
  
  // Advanced filters
  const [fromDate, setFromDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [filterInstructor, setFilterInstructor] = useState<string>('all');
  const [filterQuiz, setFilterQuiz] = useState<string>('all');
  const [filterScore, setFilterScore] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Extract unique values for filters
    const participantNames = Array.from(new Set(results.map(r => r.participant.name)));
    setUniqueParticipants(participantNames);
    
    const instructorNames = Array.from(new Set(results.map(r => r.participant.instructor)));
    setUniqueInstructors(instructorNames);
    
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
      const scoreOn20 = (result: QuizResult) => Math.round((result.totalPoints / result.maxPoints) * 20);
      
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
    }

    if (sortDirection === 'asc') {
      return compareValueA > compareValueB ? 1 : -1;
    } else {
      return compareValueA < compareValueB ? 1 : -1;
    }
  });

  const handleSort = (field: SortField) => {
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
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const resetFilters = () => {
    setFromDate(subDays(new Date(), 30));
    setToDate(new Date());
    setFilterInstructor('all');
    setFilterQuiz('all');
    setFilterScore('all');
  };

  // Calculate summary stats
  const calculateAverageScore = () => {
    return results.length > 0 
      ? Math.round((results.reduce((sum, r) => sum + (r.totalPoints / r.maxPoints * 20), 0) / results.length) * 10) / 10
      : 0;
  };

  return {
    searchQuery,
    filteredResults,
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
    averageScore: calculateAverageScore(),
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
  };
};
