
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ScoreVisualizationsProps {
  correctQuestions: number;
  incorrectQuestions: number;
  totalPoints: number;
  maxPoints: number;
  successRate: number;
  className?: string;
}

const ScoreVisualizations = ({ 
  correctQuestions, 
  incorrectQuestions,
  totalPoints,
  maxPoints,
  successRate,
  className = ''
}: ScoreVisualizationsProps) => {
  // Data for pie chart
  const pieData = [
    { name: 'Réponses correctes', value: correctQuestions, color: '#4ade80' },
    { name: 'Réponses incorrectes', value: incorrectQuestions, color: '#f87171' }
  ];

  return (
    <div className={`mb-8 animate-fade-in ${className} print:break-inside-avoid`}>
      <h3 className="text-lg font-semibold mb-4">Analyse des performances</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Circle progress indicator */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Taux de réussite
          </h4>
          <div className="w-48 h-48">
            <div className="w-full h-full" style={{ position: 'relative' }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: `conic-gradient(#4ade80 ${successRate}%, #f3f4f6 0)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '10%',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} className="dark:bg-gray-800">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-gray-800 dark:text-white">
                      {Math.floor(successRate)}%
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Taux de réussite
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Score: {totalPoints}/{maxPoints} points
          </p>
        </div>
        
        {/* Pie chart of correct/incorrect answers */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Répartition des réponses
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={30}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreVisualizations;
