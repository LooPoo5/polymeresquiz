
import React from 'react';
import { LucideIcon } from 'lucide-react';
import IndicatorCard from './IndicatorCard';

interface PercentileIndicatorProps {
  icon: LucideIcon;
  title: string;
  percentile: number;
  participantName: string;
  description: string;
}

const PercentileIndicator: React.FC<PercentileIndicatorProps> = ({
  icon,
  title,
  percentile,
  participantName,
  description
}) => {
  return (
    <IndicatorCard icon={icon} title={title}>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{percentile}%</span>
        <span className="text-sm text-gray-500 mb-1">des participants</span>
      </div>
      <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-brand-red h-full rounded-full"
          style={{ width: `${percentile}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {participantName} {description} {percentile}% des participants.
      </p>
    </IndicatorCard>
  );
};

export default PercentileIndicator;
