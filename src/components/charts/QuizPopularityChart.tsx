
import React from 'react';
import { Quiz, QuizResult } from '@/context/QuizContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList
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
      name: quiz.title,
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
    const baseHeight = 180;
    const heightPerItem = 25;
    const itemCount = Math.min(chartData.length, 8); // Cap at 8 items for compact display
    return baseHeight + (itemCount * heightPerItem);
  };

  // Custom tooltip component
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

  // Custom label for bars to show the count
  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text 
        x={x + width + 5} 
        y={y + 10} 
        fill="#666" 
        textAnchor="start" 
        fontSize={11}
      >
        {value}
      </text>
    );
  };

  return (
    <div className="w-full bg-white p-3 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Popularité des Quiz</h3>
      <div style={{ height: getDynamicHeight() }} className="w-full">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData.slice(0, 8)} // Limit to top 8 for better visibility
                layout="vertical" 
                margin={{ top: 15, right: 50, bottom: 5, left: 10 }}
                barSize={16}
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
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  type="category"
                  width={10}
                  axisLine={false}
                  tickLine={false}
                  tick={false}
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
                >
                  {chartData.slice(0, 8).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "#AF0E0E" : `rgba(175, 14, 14, ${0.9 - (index * 0.1)})`} 
                    />
                  ))}
                  <LabelList 
                    dataKey="count" 
                    position="right" 
                    content={renderCustomBarLabel}
                  />
                  <LabelList 
                    dataKey="name" 
                    position="insideTopLeft" 
                    fill="#333"
                    fontSize={10}
                    fontWeight="500"
                    offset={10}
                    formatter={(value: string) => value.length > 25 ? `${value.substring(0, 25)}...` : value}
                  />
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
