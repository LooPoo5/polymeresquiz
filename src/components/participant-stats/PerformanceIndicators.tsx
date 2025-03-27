
import React from 'react';
import { BarChart, Award, Zap, Calendar } from 'lucide-react';
import { ParticipantStats } from '@/utils/participantStats';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Award className="text-brand-red" size={16} />
            <span>Score</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{stats.comparisonStats.scorePercentile}%</span>
            <span className="text-sm text-gray-500 mb-1">des participants</span>
          </div>
          <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-brand-red h-full rounded-full"
              style={{ width: `${stats.comparisonStats.scorePercentile}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.name} a un meilleur score que {stats.comparisonStats.scorePercentile}% des participants.
          </p>
        </div>
        
        {/* Speed Percentile */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Zap className="text-brand-red" size={16} />
            <span>Rapidité</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{stats.comparisonStats.speedPercentile}%</span>
            <span className="text-sm text-gray-500 mb-1">des participants</span>
          </div>
          <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-brand-red h-full rounded-full"
              style={{ width: `${stats.comparisonStats.speedPercentile}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.name} est plus rapide que {stats.comparisonStats.speedPercentile}% des participants.
          </p>
        </div>
        
        {/* First & Last Quiz */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Calendar className="text-brand-red" size={16} />
            <span>Premier quiz</span>
          </div>
          <div className="text-base font-medium">
            {format(stats.firstQuizDate, 'PPP', { locale: fr })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Calendar className="text-brand-red" size={16} />
            <span>Dernier quiz</span>
          </div>
          <div className="text-base font-medium">
            {format(stats.lastQuizDate, 'PPP', { locale: fr })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceIndicators;
