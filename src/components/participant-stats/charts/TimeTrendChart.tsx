
import React from 'react';
import { Clock } from 'lucide-react';
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

interface TimeTrendChartProps {
  durationData: Array<{
    date: string;
    duration: number;
  }>;
  chartConfig: any;
}

const TimeTrendChart: React.FC<TimeTrendChartProps> = ({ durationData, chartConfig }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Clock size={18} className="text-brand-red" />
        Temps de réalisation (minutes)
      </h3>
      <div className="h-64">
        <ChartContainer config={chartConfig}>
          <LineChart data={durationData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis 
              className="text-xs" 
              tickFormatter={(value) => String(Math.floor(value))}
              allowDecimals={false}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="text-sm font-medium">{payload[0].payload.date}</div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[var(--color-time)]" />
                        <span>Temps: {payload[0].value} min</span>
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="duration"
              name="time"
              strokeWidth={2}
              stroke="var(--color-time)"
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default TimeTrendChart;
