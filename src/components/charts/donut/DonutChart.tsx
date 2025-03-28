
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from '@/components/ui/chart';
import { CHART_COLORS } from '../utils/chartConfig';
import { QuizChartData } from '../utils/prepareChartData';
import CustomTooltipContent from './CustomTooltipContent';

interface DonutChartProps {
  chartData: QuizChartData[];
}

const DonutChart: React.FC<DonutChartProps> = ({ chartData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="count"
          nameKey="fullTitle"
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            // Only show count label for segments with enough space (above 5%)
            if (percent < 0.05) return null;
            
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            
            return (
              <text 
                x={x} 
                y={y} 
                fill="#fff"
                textAnchor="middle" 
                dominantBaseline="central"
                style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textShadow: '0px 0px 3px rgba(0,0,0,0.5)'
                }}
              >
                {chartData[index].count}
              </text>
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={CHART_COLORS[index % CHART_COLORS.length]} 
            />
          ))}
        </Pie>
        <ChartTooltip 
          content={<CustomTooltipContent />}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
