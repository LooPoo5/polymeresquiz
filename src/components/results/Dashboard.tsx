
import React from 'react';
import { QuizResult } from '@/context/types';
import PerformanceSummary from './PerformanceSummary';
import PerformanceTrendChart from './PerformanceTrendChart';

interface DashboardProps {
  results: QuizResult[];
  filteredResults: QuizResult[];
  uniqueParticipants: string[];
  averageScore: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  results,
  filteredResults,
  uniqueParticipants,
  averageScore
}) => {
  return (
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
  );
};

export default Dashboard;
