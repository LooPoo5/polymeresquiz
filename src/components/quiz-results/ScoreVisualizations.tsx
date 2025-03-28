
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
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
    <div className={`mb-8 animate-fade-in ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Analyse des performances</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual score indicator */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <div 
              className="relative w-48 h-48 flex items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#4ade80 ${successRate}%, #f3f4f6 0)`,
              }}
            >
              <div className="absolute inset-[10%] bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
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
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Score: {totalPoints}/{maxPoints} points
            </p>
          </div>
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
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} questions`, 'Quantité']} 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreVisualizations;
