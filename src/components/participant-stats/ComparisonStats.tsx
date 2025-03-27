
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
  YAxis,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';
import PerformanceIndicators from './PerformanceIndicators';

interface ComparisonStatsProps {
  stats: ParticipantStats;
}

const ComparisonStats: React.FC<ComparisonStatsProps> = ({ stats }) => {
  // Chart configurations
  const chartConfig = {
    score: {
      label: "Score sur 20",
      theme: {
        light: "#d946ef", // Magenta
        dark: "#d946ef",
      },
    },
    time: {
      label: "Temps (minutes)",
      theme: {
        light: "#0ea5e9", // Ocean blue
        dark: "#0ea5e9",
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
      category: "participant"
    },
    {
      name: "Moyenne",
      value: Number((stats.comparisonStats.globalAverageDuration / 60).toFixed(1)),
      color: averageColor,
      category: "average"
    }
  ];

  // Format minutes with proper suffix
  const formatMinutes = (value: number) => `${value} min`;

  // Format score with /20
  const formatScore = (value: number) => `${value}/20`;

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
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={scoreData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 20]} tickCount={5} label={{ value: 'Score (/20)', angle: -90, position: 'insideLeft', offset: 0 }} />
                <ChartTooltip
                  content={(props) => {
                    if (props.active && props.payload && props.payload.length) {
                      const payload = props.payload[0];
                      return (
                        <div className="bg-white border border-gray-200 shadow-md rounded-md p-2">
                          <div className="text-sm font-medium">Score moyen</div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload.payload.color }} />
                            <span>{payload.payload.name}: {formatScore(payload.payload.value)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" name="Score">
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={formatScore} style={{ fill: '#333', fontWeight: 'bold' }} />
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Comparison Chart */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Clock size={16} className="text-brand-red" />
            Temps moyen
          </h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={timeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Temps (min)', angle: -90, position: 'insideLeft', offset: 0 }} />
                <ChartTooltip
                  content={(props) => {
                    if (props.active && props.payload && props.payload.length) {
                      const payload = props.payload[0];
                      return (
                        <div className="bg-white border border-gray-200 shadow-md rounded-md p-2">
                          <div className="text-sm font-medium">Temps moyen</div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload.payload.color }} />
                            <span>{payload.payload.name}: {formatMinutes(payload.payload.value)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" name="Temps">
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={formatMinutes} style={{ fill: '#333', fontWeight: 'bold' }} />
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <PerformanceIndicators stats={stats} />
    </>
  );
};

export default ComparisonStats;
