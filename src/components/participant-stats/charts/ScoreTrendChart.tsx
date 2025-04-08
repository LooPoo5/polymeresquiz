
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  CartesianGrid, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis 
} from 'recharts';

interface ScoreTrendChartProps {
  scoreData: Array<{
    date: string;
    score: number;
  }>;
  chartConfig: any;
}

const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ scoreData, chartConfig }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <TrendingUp size={18} className="text-brand-red" />
        Évolution des scores
      </h3>
      <div className="h-64">
        <ChartContainer config={chartConfig}>
          <LineChart data={scoreData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis domain={[0, 20]} className="text-xs" />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].value;
                  // Safely format the value - fix TypeScript error
                  const displayValue = typeof data === 'number' 
                    ? data.toFixed(1) 
                    : data;
                    
                  return (
                    <ChartTooltipContent>
                      <div className="text-sm font-medium">{payload[0].payload.date}</div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[var(--color-score)]" />
                        <span>Score: {displayValue}/20</span>
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="score"
              strokeWidth={2}
              stroke="var(--color-score)"
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default ScoreTrendChart;
