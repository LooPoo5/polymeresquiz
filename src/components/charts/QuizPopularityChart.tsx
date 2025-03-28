
import React from 'react';
import { Quiz, QuizResult } from '@/context/QuizContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  TooltipItem,
  TooltipLabel,
  useChart
} from '@/components/ui/chart';

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
      name: quiz.title.length > 15 ? `${quiz.title.substring(0, 15)}...` : quiz.title,
      fullTitle: quiz.title,
      count: quizUsageCounts[quiz.id] || 0,
      id: quiz.id
    })).sort((a, b) => b.count - a.count); // Sort by popularity (descending)
  };

  const chartData = prepareChartData();

  // Define chart colors configuration
  const chartConfig = {
    count: {
      label: "Utilisations",
      theme: {
        light: "#AF0E0E",
        dark: "#FF6B6B"
      }
    }
  };

  // Generate a dynamic height based on the number of quiz items
  const getDynamicHeight = () => {
    const baseHeight = 200;
    const heightPerItem = 30;
    const itemCount = Math.min(chartData.length, 6); // Cap at 6 items for compact display
    return baseHeight + (itemCount * heightPerItem);
  };

  // Create a custom tooltip component that properly passes the config prop
  const CustomTooltipContent = ({ active, payload }: any) => {
    const { config } = useChart();
    
    if (active && payload && payload.length) {
      return (
        <ChartTooltipContent>
          <TooltipLabel
            payload={payload}
            label={payload[0].payload.fullTitle}
            config={config}
          />
          <TooltipItem
            item={payload[0]}
            index={0}
            config={config} 
            indicator="dot"
            hideIndicator={false}
          />
        </ChartTooltipContent>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Popularité des Quiz</h3>
      <div style={{ height: getDynamicHeight() }} className="w-full">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData.slice(0, 8)} // Limit to top 8 for better visibility
                layout="vertical" 
                margin={{ top: 5, right: 20, bottom: 5, left: 80 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  horizontal={true}
                  vertical={false} 
                  stroke="#f0f0f0" 
                />
                <XAxis 
                  type="number"
                  tickFormatter={(value) => Math.floor(value).toString()}
                  domain={[0, 'dataMax + 1']}
                  allowDecimals={false}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={<CustomTooltipContent />} 
                />
                <Bar 
                  dataKey="count" 
                  name="Utilisations" 
                  fill="#AF0E0E" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  {chartData.slice(0, 8).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "#AF0E0E" : `rgba(175, 14, 14, ${0.9 - (index * 0.1)})`} 
                    />
                  ))}
                </Bar>
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
