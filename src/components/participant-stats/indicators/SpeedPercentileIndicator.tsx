
import React from 'react';
import { Zap } from 'lucide-react';
import PercentileIndicator from './PercentileIndicator';

interface SpeedPercentileIndicatorProps {
  speedPercentile: number;
  participantName: string;
}

const SpeedPercentileIndicator: React.FC<SpeedPercentileIndicatorProps> = ({
  speedPercentile,
  participantName
}) => {
  return (
    <PercentileIndicator
      icon={Zap}
      title="Rapidité"
      percentile={speedPercentile}
      participantName={participantName}
      description="est plus rapide que"
    />
  );
};

export default SpeedPercentileIndicator;
