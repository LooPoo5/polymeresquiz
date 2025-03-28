
import React from 'react';
import { QuizResult } from '@/context/types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PerformanceTrendChartProps {
  results: QuizResult[];
  className?: string;
}

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ results, className }) => {
  // Get the last 6 months for the chart
  const getChartData = () => {
    const chartData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthLabel = format(monthDate, 'MMM yyyy');
      
      // Filter results for this month
      const monthResults = results.filter(result => 
        isWithinInterval(result.endTime, { start: monthStart, end: monthEnd })
      );
      
      // Calculate average score if there are results
      let averageScore = 0;
      if (monthResults.length > 0) {
        const totalScorePercentage = monthResults.reduce((sum, result) => 
          sum + (result.totalPoints / result.maxPoints), 0);
        averageScore = Math.round((totalScorePercentage / monthResults.length) * 20 * 10) / 10;
      }
      
      chartData.push({
        month: monthLabel,
        averageScore,
        quizCount: monthResults.length
      });
    }
    
    return chartData;
  };
  
  const chartData = getChartData();
  
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4">Évolution des performances</h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }} 
              tickMargin={10}
            />
            <YAxis 
              yAxisId="left"
              domain={[0, 20]}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              label={{ 
                value: 'Score moyen (/20)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#666' }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              label={{
                value: 'Nombre de quiz',
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#666' }
              }}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, '']}
              contentStyle={{ 
                borderRadius: '4px', 
                border: '1px solid #ddd', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageScore"
              name="Score moyen (/20)"
              stroke="#f43f5e"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="quizCount"
              name="Nombre de quiz"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;
