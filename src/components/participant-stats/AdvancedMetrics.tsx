
import React from 'react';
import { Award, TrendingUp, Activity, Clock, Star } from 'lucide-react';
import { ParticipantStats, formatDuration } from '@/utils/participantStats';
import ProgressMetricsCard from './metrics/ProgressMetricsCard';
import ConsistencyMetricsCard from './metrics/ConsistencyMetricsCard';
import TimeEfficiencyCard from './metrics/TimeEfficiencyCard';
import AchievementCard from './metrics/AchievementCard';

interface AdvancedMetricsProps {
  stats: ParticipantStats;
}

const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Award size={20} className="text-brand-red" />
        Métriques avancées
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Metrics */}
        <ProgressMetricsCard metrics={stats.progressMetrics} />
        
        {/* Consistency Metrics */}
        <ConsistencyMetricsCard metrics={stats.consistencyMetrics} />
        
        {/* Time Efficiency */}
        <TimeEfficiencyCard 
          metrics={stats.timeEfficiencyMetrics} 
          averageDuration={stats.averageDurationInSeconds} 
        />
        
        {/* Achievement Metrics */}
        <AchievementCard metrics={stats.achievementMetrics} quizCount={stats.quizCount} />
      </div>
    </div>
  );
};

export default AdvancedMetrics;
