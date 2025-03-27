
import React from 'react';
import { Users, TrendingUp, Clock } from 'lucide-react';
import { ParticipantStats } from '@/utils/participantStats';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis 
} from 'recharts';
import PerformanceIndicators from './PerformanceIndicators';

interface ComparisonStatsProps {
  stats: ParticipantStats;
}

const ComparisonStats: React.FC<ComparisonStatsProps> = ({ stats }) => {
  // Chart configurations
  const chartConfig = {
    comparison: {
      label: "Comparaison",
      theme: {
        light: "#8b5cf6",
        dark: "#8b5cf6",
      },
    },
    participant: {
      label: "Participant",
      theme: {
        light: "#AF0E0E", // Brand red color
        dark: "#AF0E0E",
      },
    },
    average: {
      label: "Moyenne Globale",
      theme: {
        light: "#333333", // Dark gray
        dark: "#333333",
      },
    },
  };

  // Score data
  const scoreData = [
    {
      label: "Score moyen",
      participant: stats.averageScoreOn20.toFixed(1),
      average: stats.comparisonStats.globalAverageScore.toFixed(1),
    }
  ];

  // Time data
  const timeData = [
    {
      label: "Temps moyen (min)",
      participant: (stats.averageDurationInSeconds / 60).toFixed(1),
      average: (stats.comparisonStats.globalAverageDuration / 60).toFixed(1),
    }
  ];

  return (
    <>
      {/* Parent Container */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users size={18} className="text-brand-red" />
          Comparaison avec les autres participants
        </h3>
        
        {/* Score Comparison Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <TrendingUp size={16} className="text-brand-red" />
            Score moyen
          </h4>
          <div className="h-40">
            <ChartContainer config={chartConfig}>
              <RechartsBarChart
                data={scoreData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 50, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis type="number" className="text-xs" domain={[0, 20]} />
                <YAxis type="category" dataKey="label" width={0} className="text-xs" />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent>
                          <div className="text-sm font-medium">Score moyen</div>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[var(--color-participant)]" />
                              <span>{stats.name}: {payload[0].value}/20</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[var(--color-average)]" />
                              <span>Moyenne: {payload[1].value}/20</span>
                            </div>
                          </div>
                        </ChartTooltipContent>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="participant" name="participant" fill="var(--color-participant)" />
                <Bar dataKey="average" name="average" fill="var(--color-average)" />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Time Comparison Chart */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Clock size={16} className="text-brand-red" />
            Temps moyen
          </h4>
          <div className="h-40">
            <ChartContainer config={chartConfig}>
              <RechartsBarChart
                data={timeData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 50, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis type="number" className="text-xs" />
                <YAxis type="category" dataKey="label" width={0} className="text-xs" />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent>
                          <div className="text-sm font-medium">Temps moyen</div>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[var(--color-participant)]" />
                              <span>{stats.name}: {payload[0].value} min</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[var(--color-average)]" />
                              <span>Moyenne: {payload[1].value} min</span>
                            </div>
                          </div>
                        </ChartTooltipContent>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="participant" name="participant" fill="var(--color-participant)" />
                <Bar dataKey="average" name="average" fill="var(--color-average)" />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <PerformanceIndicators stats={stats} />
    </>
  );
};

export default ComparisonStats;
