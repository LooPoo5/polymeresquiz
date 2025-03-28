
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

  return (
    <div className="w-full bg-white p-3 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Popularité des Quiz</h3>
      <div className="grid grid-cols-5 h-64">
        <div className="col-span-3 relative">
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
        <div className="col-span-2 pl-6">
          <Legend 
            content={<CustomLegend />}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPopularityChart;
