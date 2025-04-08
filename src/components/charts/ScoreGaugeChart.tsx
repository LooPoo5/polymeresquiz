
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CircleGauge } from 'lucide-react';

interface ScoreGaugeChartProps {
  score: number;
  maxScore: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  label?: string;
  animated?: boolean;
}

const gaugeVariants = cva("relative flex items-center justify-center rounded-full", {
  variants: {
    size: {
      sm: "h-24 w-24",
      md: "h-36 w-36",
      lg: "h-48 w-48",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const labelVariants = cva("font-bold flex flex-col items-center justify-center", {
  variants: {
    size: {
      sm: "text-xl",
      md: "text-3xl",
      lg: "text-4xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const ScoreGaugeChart: React.FC<ScoreGaugeChartProps> = ({
  score,
  maxScore,
  size = 'md',
  showIcon = true,
  className,
  label,
  animated = true,
}) => {
  // Calculate percentage for the gauge
  const percentage = (score / maxScore) * 100;
  
  // Data for the gauge
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: maxScore - score },
  ];
  
  // Define colors based on score percentage
  const getColor = () => {
    if (percentage >= 80) return "#10B981"; // Green
    if (percentage >= 60) return "#0EA5E9"; // Blue
    if (percentage >= 40) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  const scoreColor = getColor();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const scoreVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <motion.div 
      className={cn(gaugeVariants({ size }), className)}
      variants={animated ? containerVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={0}
            dataKey="value"
          >
            <Cell key="score" fill={scoreColor} />
            <Cell key="remaining" fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        variants={animated ? scoreVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      >
        {showIcon && (
          <CircleGauge className="w-6 h-6 mb-1" style={{ color: scoreColor }} />
        )}
        <div className={labelVariants({ size })}>
          <div className="flex items-end">
            <span style={{ color: scoreColor }}>{score.toFixed(1)}</span>
            <span className="text-gray-400 text-sm ml-1 mb-1">/{maxScore}</span>
          </div>
          {label && <span className="text-sm text-gray-500 mt-1">{label}</span>}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScoreGaugeChart;
