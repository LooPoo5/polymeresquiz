
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';

interface ScoreComparisonChartProps {
  scoreData: Array<{
    name: string;
    value: number;
    color: string;
    category: string;
  }>;
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ scoreData }) => {
  // Format score with /20
  const formatScore = (value: number) => `${value}/20`;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <TrendingUp size={16} className="text-brand-red" />
        Score moyen
      </h4>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={scoreData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="name" />
            <YAxis 
              domain={[0, 20]} 
              tickCount={5} 
              label={{ 
                value: 'Score (/20)', 
                angle: -90, 
                position: 'insideLeft', 
                offset: 0 
              }} 
            />
            <Bar dataKey="value" name="Score">
              {scoreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList 
                dataKey="value" 
                position="top" 
                formatter={formatScore} 
                style={{ fill: '#333', fontWeight: 'bold' }} 
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreComparisonChart;
