
import React from 'react';
import { ParticipantStats } from '@/utils/participantStats';
import ScoreTrendChart from './charts/ScoreTrendChart';
import TimeTrendChart from './charts/TimeTrendChart';

interface StatsTrendChartsProps {
  stats: ParticipantStats;
}

const StatsTrendCharts: React.FC<StatsTrendChartsProps> = ({ stats }) => {
  // Chart configurations
  const chartConfig = {
    score: {
      label: "Score sur 20",
      theme: {
        light: "#AF0E0E", // Brand red color
        dark: "#AF0E0E",
      },
    },
    time: {
      label: "Temps (minutes)",
      theme: {
        light: "#333333", // Dark gray
        dark: "#333333",
      },
    },
  };

  return (
    <>
      <ScoreTrendChart scoreData={stats.scoreData} chartConfig={chartConfig} />
      <TimeTrendChart durationData={stats.durationData} chartConfig={chartConfig} />
    </>
  );
};

export default StatsTrendCharts;
