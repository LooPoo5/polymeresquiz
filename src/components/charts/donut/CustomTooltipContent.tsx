
import React from 'react';
import { useChart } from '@/components/ui/chart';
import {
  ChartTooltipContent,
  TooltipItem,
  TooltipLabel
} from '@/components/ui/chart';

const CustomTooltipContent = ({ active, payload }: any) => {
  const { config } = useChart();
  
  if (active && payload && payload.length) {
    const quizData = payload[0].payload;
    
    return (
      <ChartTooltipContent>
        <TooltipLabel
          payload={payload}
          label={quizData.fullTitle}
          config={config}
          labelClassName="mb-1 font-semibold"
        />
        <TooltipItem
          item={payload[0]}
          index={0}
          config={config} 
          indicator="dot"
          hideIndicator={false}
        />
      </ChartTooltipContent>
    );
  }
  return null;
};

export default CustomTooltipContent;
