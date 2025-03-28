
import React from 'react';
import { Quiz, QuizResult } from '@/context/QuizContext';
import { Legend } from 'recharts';
import { ChartContainer, useChart } from '@/components/ui/chart';
import { prepareChartData } from './utils/prepareChartData';
import { chartConfig } from './utils/chartConfig';
import DonutChart from './donut/DonutChart';
import CustomLegend from './donut/CustomLegend';
import CenterDisplay from './donut/CenterDisplay';

interface QuizPopularityChartProps {
  quizzes: Quiz[];
  results: QuizResult[];
}

const QuizPopularityChart: React.FC<QuizPopularityChartProps> = ({ quizzes, results }) => {
  const chartData = prepareChartData(quizzes, results);
  
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
        {/* Center the chart by allocating 7 columns */}
        <div className="col-span-7 relative flex items-center justify-center">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <DonutChart chartData={chartData} />
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Pas assez de données pour afficher le graphique
            </div>
          )}
          
          {/* Centre count display */}
          {chartData.length > 0 && <CenterDisplay chartData={chartData} />}
        </div>
        
        {/* List of quizzes on the right */}
        <div className="col-span-5 pl-4 overflow-y-auto">
          <h4 className="font-medium text-sm mb-2 text-gray-700">Liste des Quiz</h4>
          <div className="space-y-1.5 pr-2">
            {sortedQuizzes.map((quiz) => {
              const count = results.filter(r => r.quizId === quiz.id).length;
              return (
                <div key={quiz.id} className="flex items-center justify-between bg-gray-50 p-1.5 rounded text-sm">
                  <span className="truncate max-w-[70%] text-gray-800">{quiz.title}</span>
                  <span className="bg-brand-red text-white text-xs rounded-full px-2 py-0.5 font-medium">
                    {count} quiz{count !== 1 ? 's' : ''}
                  </span>
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
