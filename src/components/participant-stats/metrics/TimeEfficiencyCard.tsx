
import React from 'react';
import { Clock, Timer, Zap } from 'lucide-react';
import { TimeEfficiencyMetrics } from '@/utils/participantStats/types';
import { formatDuration } from '@/utils/participantStats';
import MetricCard from './MetricCard';

interface TimeEfficiencyCardProps {
  metrics: TimeEfficiencyMetrics;
  averageDuration: number;
}

const TimeEfficiencyCard: React.FC<TimeEfficiencyCardProps> = ({ 
  metrics, 
  averageDuration 
}) => {
  return (
    <MetricCard title="Efficacité temporelle" icon={Clock}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Temps par question</span>
          <span className="font-medium">{formatDuration(Math.round(metrics.averageTimePerQuestion))}</span>
        </div>
        
        {metrics.fastestQuiz.id && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quiz le plus rapide</span>
            <div className="flex flex-col items-end">
              <span className="font-medium flex items-center gap-1">
                <Zap size={16} className="text-amber-500" />
                {formatDuration(metrics.fastestQuiz.durationInSeconds)}
              </span>
              <span className="text-xs text-gray-500">{metrics.fastestQuiz.title}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Amélioration de la vitesse</span>
          <div className={`font-medium flex items-center gap-1 ${
            metrics.timeImprovement > 0 ? "text-green-500" : 
            metrics.timeImprovement < 0 ? "text-red-500" : "text-gray-500"
          }`}>
            {metrics.timeImprovement > 0 ? (
              <>
                <Zap size={16} />
                {Math.abs(metrics.timeImprovement).toFixed(1)}% plus rapide
              </>
            ) : metrics.timeImprovement < 0 ? (
              <>
                <Clock size={16} />
                {Math.abs(metrics.timeImprovement).toFixed(1)}% plus lent
              </>
            ) : (
              "Stable"
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Temps moyen total</span>
          <span className="font-medium">{formatDuration(Math.round(averageDuration))}</span>
        </div>
      </div>
    </MetricCard>
  );
};

export default TimeEfficiencyCard;
