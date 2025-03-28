
import React from 'react';
import { Quiz, QuizResult } from '@/context/QuizContext';
import { ChartContainer } from '@/components/ui/chart';
import { prepareChartData } from './utils/prepareChartData';
import { chartConfig, CHART_COLORS } from './utils/chartConfig';
import DonutChart from './donut/DonutChart';

interface QuizPopularityChartProps {
  quizzes: Quiz[];
  results: QuizResult[];
}

const QuizPopularityChart: React.FC<QuizPopularityChartProps> = ({ quizzes, results }) => {
  const chartData = prepareChartData(quizzes, results);
  const totalQuizTaken = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Sort quizzes by usage count
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const aCount = results.filter(r => r.quizId === a.id).length;
    const bCount = results.filter(r => r.quizId === b.id).length;
    return bCount - aCount;
  });

  return (
    <div className="w-full bg-white p-3 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Popularité des Quiz</h3>
      <div className="grid grid-cols-12 h-64">
        {/* Left side with total count */}
        <div className="col-span-2 flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">{totalQuizTaken}</div>
            <div className="text-xs text-gray-500">Quiz réalisés</div>
          </div>
        </div>
        
        {/* Center the chart in 5 columns with explicit height */}
        <div className="col-span-5 flex items-center justify-center" style={{ height: '240px' }}>
          {chartData.length > 0 ? (
            <div className="w-full h-full">
              <ChartContainer config={chartConfig}>
                <DonutChart chartData={chartData} />
              </ChartContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Pas assez de données pour afficher le graphique
            </div>
          )}
        </div>
        
        {/* List of quizzes on the right */}
        <div className="col-span-5 pl-4 overflow-y-auto flex items-center">
          <div className="space-y-1.5 pr-2 w-full">
            {sortedQuizzes.map((quiz, index) => {
              const colorIndex = chartData.findIndex(item => item.id === quiz.id);
              const dotColor = colorIndex >= 0 ? CHART_COLORS[colorIndex % CHART_COLORS.length] : '#CBD5E0';
              
              return (
                <div key={quiz.id} className="flex items-center p-1.5 rounded text-sm">
                  <span 
                    className="h-3 w-3 rounded-full mr-2 flex-shrink-0" 
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="truncate text-gray-800">{quiz.title}</span>
                </div>
              );
            })}
            {sortedQuizzes.length === 0 && (
              <div className="text-gray-400 text-xs italic">Aucun quiz disponible</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPopularityChart;
