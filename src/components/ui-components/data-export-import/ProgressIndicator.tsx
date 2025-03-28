
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  isActive: boolean;
  progress: number;
}

const ProgressIndicator = ({ isActive, progress }: ProgressIndicatorProps) => {
  if (!isActive || progress <= 0) return null;
  
  return <Progress value={progress} className="w-full mt-2" />;
};

export default ProgressIndicator;
