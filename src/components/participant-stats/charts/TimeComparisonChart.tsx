
import React from 'react';
import { Clock } from 'lucide-react';
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
import { formatDuration } from '@/utils/participantStats';

interface TimeComparisonChartProps {
  timeData: Array<{
    name: string;
    value: number;
    color: string;
    category: string;
    seconds: number;
  }>;
}

const TimeComparisonChart: React.FC<TimeComparisonChartProps> = ({ timeData }) => {
  // Format minutes with proper suffix and include seconds
  const formatMinutesAndSeconds = (value: number, entry: any) => {
    if (entry && entry.seconds) {
      return formatDuration(entry.seconds);
    }
    return `${value} min`;
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <Clock size={16} className="text-brand-red" />
        Temps moyen
      </h4>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={timeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="name" />
            <YAxis 
              label={{ 
                value: 'Temps (min)', 
                angle: -90, 
                position: 'insideLeft', 
                offset: 0 
              }} 
              tickFormatter={(value) => String(Math.floor(value))} 
              domain={[0, 'dataMax + 1']}
              allowDecimals={false}
            />
            <Bar dataKey="value" name="Temps">
              {timeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList 
                dataKey="value" 
                position="top" 
                formatter={formatMinutesAndSeconds} 
                style={{ fill: '#333', fontWeight: 'bold' }} 
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeComparisonChart;
