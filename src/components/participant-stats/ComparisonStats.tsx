
import React from 'react';
import { Users, BarChart } from 'lucide-react';
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
        light: "#8b5cf6", // Vivid purple
        dark: "#8b5cf6",
      },
    },
    participant: {
      label: "Participant",
      theme: {
        light: "#f97316", // Bright orange
        dark: "#f97316",
      },
    },
    average: {
      label: "Moyenne Globale",
      theme: {
        light: "#6e59a5", // Tertiary purple
        dark: "#6e59a5",
      },
    },
  };

  return (
    <>
      {/* Comparison Bar Chart */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users size={18} className="text-brand-red" />
          Comparaison avec les autres participants
        </h3>
        <div className="h-64">
          <ChartContainer config={chartConfig}>
            <RechartsBarChart
              data={[
                {
                  metric: "Score moyen",
                  participant: stats.averageScoreOn20.toFixed(1),
                  average: stats.comparisonStats.globalAverageScore.toFixed(1),
                },
                {
                  metric: "Temps moyen (min)",
                  participant: (stats.averageDurationInSeconds / 60).toFixed(1),
                  average: (stats.comparisonStats.globalAverageDuration / 60).toFixed(1),
                }
              ]}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis type="number" className="text-xs" />
              <YAxis type="category" dataKey="metric" width={80} className="text-xs" />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="text-sm font-medium">{payload[0].payload.metric}</div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[var(--color-participant)]" />
                            <span>{stats.name}: {payload[0].value}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[var(--color-average)]" />
                            <span>Moyenne: {payload[1].value}</span>
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
      
      {/* Performance Metrics */}
      <PerformanceIndicators stats={stats} />
    </>
  );
};

export default ComparisonStats;
