
import React from 'react';
import { Users, TrendingUp, Clock } from 'lucide-react';
import { ParticipantStats } from '@/utils/participantStats';
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
import { formatDuration } from '@/utils/participantStats';

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

  // Format score with /20
  const formatScore = (value: number) => `${value}/20`;
  
  // Format minutes with proper suffix and include seconds
  const formatMinutesAndSeconds = (value: number, entry: any) => {
    if (entry && entry.seconds) {
      return formatDuration(entry.seconds);
    }
    return `${value} min`;
  };

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
                <YAxis 
                  domain={[0, 20]} 
                  tickCount={5} 
                  label={{ 
                    value: 'Score (/20)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    offset: 0 
                  }} 
                />
                <Bar dataKey="value" name="Score">
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    formatter={formatScore} 
                    style={{ fill: '#333', fontWeight: 'bold' }} 
                  />
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
                <YAxis 
                  label={{ 
                    value: 'Temps (min)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    offset: 0 
                  }} 
                  tickFormatter={(value) => String(Math.floor(value))} 
                  domain={[0, 'dataMax + 1']}
                  allowDecimals={false}
                />
                <Bar dataKey="value" name="Temps">
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    formatter={formatMinutesAndSeconds} 
                    style={{ fill: '#333', fontWeight: 'bold' }} 
                  />
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
