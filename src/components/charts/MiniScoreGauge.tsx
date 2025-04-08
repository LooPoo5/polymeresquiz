
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface MiniScoreGaugeProps {
  score: number;
  maxScore: number;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MiniScoreGauge: React.FC<MiniScoreGaugeProps> = ({
  score,
  maxScore,
  className,
  showText = true,
  size = 'md',
}) => {
  // Calculate percentage
  const percentage = (score / maxScore) * 100;
  
  // Determine color based on score
  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Determine height based on size
  const getHeight = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'lg': return 'h-6';
      default: return 'h-4';
    }
  };
  
  return (
    <div className={cn('space-y-1', className)}>
      {showText && (
        <div className="flex justify-between text-sm font-medium">
          <span>{score.toFixed(1)}</span>
          <span className="text-muted-foreground">/ {maxScore}</span>
        </div>
      )}
      <Progress 
        value={percentage} 
        className={cn(getHeight(), 'w-full rounded-full', getProgressColor())}
      />
    </div>
  );
};

export default MiniScoreGauge;
