
import React from 'react';
import { Award } from 'lucide-react';
import PercentileIndicator from './PercentileIndicator';

interface ScorePercentileIndicatorProps {
  scorePercentile: number;
  participantName: string;
}

const ScorePercentileIndicator: React.FC<ScorePercentileIndicatorProps> = ({
  scorePercentile,
  participantName
}) => {
  return (
    <PercentileIndicator
      icon={Award}
      title="Score"
      percentile={scorePercentile}
      participantName={participantName}
      description="a un meilleur score que"
    />
  );
};

export default ScorePercentileIndicator;
