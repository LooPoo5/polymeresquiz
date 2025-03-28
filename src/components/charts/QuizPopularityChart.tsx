
import React from 'react';
import { Quiz, QuizResult } from '@/context/QuizContext';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend
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
      id: quiz.id,
      // Tronquer le titre pour l'affichage dans la légende
      shortName: quiz.title.length > 20 ? quiz.title.substring(0, 20) + '...' : quiz.title
    })).sort((a, b) => b.count - a.count).slice(0, 8); // Sort by popularity (descending) and limit to 8 items
  };

  const chartData = prepareChartData();
  const totalQuizTaken = chartData.reduce((sum, item) => sum + item.count, 0);

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

  // Generate color array for each data segment
  const COLORS = [
    '#AF0E0E', '#CB4335', '#E74C3C', '#EC7063', 
    '#F1948A', '#F5B7B1', '#FADBD8', '#FDEDEC'
  ];

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

  // Custom legend that formats entries
  const CustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="text-xs pl-0 space-y-1.5 mt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-sm mr-2 inline-block" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.payload.shortName}</span>
            <span className="ml-1 text-gray-500">({entry.payload.count})</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full bg-white p-3 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Popularité des Quiz</h3>
      <div className="grid grid-cols-5 h-64">
        <div className="col-span-3 relative">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<CustomTooltipContent />}
                  />
                  <Legend 
                    content={<CustomLegend />}
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Pas assez de données pour afficher le graphique
            </div>
          )}
          {/* Centre count display */}
          {chartData.length > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-3xl font-bold text-gray-800">{totalQuizTaken}</div>
              <div className="text-xs text-gray-500">Quiz réalisés</div>
            </div>
          )}
        </div>
        <div className="col-span-2">
          {/* Legend will be displayed by recharts in this area */}
        </div>
      </div>
    </div>
  );
};

export default QuizPopularityChart;
