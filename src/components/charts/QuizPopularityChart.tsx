
import React from 'react';
import { Quiz, QuizResult } from '@/context/QuizContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import TooltipItem from '@/components/ui/chart/tooltip/TooltipItem';
import TooltipLabel from '@/components/ui/chart/tooltip/TooltipLabel';

interface QuizPopularityChartProps {
  quizzes: Quiz[];
  results: QuizResult[];
}

const QuizPopularityChart: React.FC<QuizPopularityChartProps> = ({ quizzes, results }) => {
  // Calculate quiz popularity data
  const prepareChartData = () => {
    const quizUsageCounts: Record<string, number> = {};
    
    // Count the number of times each quiz has been taken
    results.forEach(result => {
      if (quizUsageCounts[result.quizId]) {
        quizUsageCounts[result.quizId]++;
      } else {
        quizUsageCounts[result.quizId] = 1;
      }
    });
    
    // Map to the format needed for the chart
    return quizzes.map(quiz => ({
      name: quiz.title.length > 20 ? `${quiz.title.substring(0, 20)}...` : quiz.title,
      fullTitle: quiz.title,
      count: quizUsageCounts[quiz.id] || 0,
    })).sort((a, b) => b.count - a.count); // Sort by popularity (descending)
  };

  const chartData = prepareChartData();

  // Define chart colors configuration
  const chartConfig = {
    count: {
      label: "Nombre d'utilisations",
      theme: {
        light: "#AF0E0E",
        dark: "#FF6B6B"
      }
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Popularité des Quiz</h3>
      <div className="h-72 w-full">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 50, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={80} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}`}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  name="Utilisations" 
                  fill="#AF0E0E" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Pas assez de données pour afficher le graphique
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPopularityChart;
