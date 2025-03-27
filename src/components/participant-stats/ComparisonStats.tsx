
import React from 'react';
import { ParticipantStats } from '@/utils/participantStats';
import PerformanceIndicators from './PerformanceIndicators';
import ChartContainer from './charts/ChartContainer';
import ScoreComparisonChart from './charts/ScoreComparisonChart';
import TimeComparisonChart from './charts/TimeComparisonChart';

interface ComparisonStatsProps {
  stats: ParticipantStats;
}

const ComparisonStats: React.FC<ComparisonStatsProps> = ({ stats }) => {
  // Color constants
  const participantColor = "#AF0E0E"; // Red
  const averageColor = "#333333"; // Dark gray

  // Score data
  const scoreData = [
    {
      name: stats.name,
      value: Number(stats.averageScoreOn20.toFixed(1)),
      color: participantColor,
      category: "participant"
    },
    {
      name: "Moyenne",
      value: Number(stats.comparisonStats.globalAverageScore.toFixed(1)),
      color: averageColor,
      category: "average"
    }
  ];

  // Time data
  const timeData = [
    {
      name: stats.name,
      value: Number((stats.averageDurationInSeconds / 60).toFixed(1)),
      color: participantColor,
      category: "participant",
      seconds: stats.averageDurationInSeconds
    },
    {
      name: "Moyenne",
      value: Number((stats.comparisonStats.globalAverageDuration / 60).toFixed(1)),
      color: averageColor,
      category: "average",
      seconds: stats.comparisonStats.globalAverageDuration
    }
  ];

  return (
    <>
      <ChartContainer>
        <ScoreComparisonChart scoreData={scoreData} />
        <TimeComparisonChart timeData={timeData} />
      </ChartContainer>
      
      {/* Performance Metrics */}
      <PerformanceIndicators stats={stats} />
    </>
  );
};

export default ComparisonStats;
