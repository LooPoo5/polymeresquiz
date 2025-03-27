
import React from 'react';
import { BarChart } from 'lucide-react';
import { ParticipantStats } from '@/utils/participantStats';

import ScorePercentileIndicator from './indicators/ScorePercentileIndicator';
import SpeedPercentileIndicator from './indicators/SpeedPercentileIndicator';
import FirstQuizIndicator from './indicators/FirstQuizIndicator';
import LastQuizIndicator from './indicators/LastQuizIndicator';

interface PerformanceIndicatorsProps {
  stats: ParticipantStats;
}

const PerformanceIndicators: React.FC<PerformanceIndicatorsProps> = ({ stats }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <BarChart size={18} className="text-brand-red" />
        Indicateurs de performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Score Percentile */}
        <ScorePercentileIndicator 
          scorePercentile={stats.comparisonStats.scorePercentile} 
          participantName={stats.name} 
        />
        
        {/* Speed Percentile */}
        <SpeedPercentileIndicator 
          speedPercentile={stats.comparisonStats.speedPercentile} 
          participantName={stats.name} 
        />
        
        {/* First Quiz */}
        <FirstQuizIndicator date={stats.firstQuizDate} />
        
        {/* Last Quiz */}
        <LastQuizIndicator date={stats.lastQuizDate} />
      </div>
    </div>
  );
};

export default PerformanceIndicators;
