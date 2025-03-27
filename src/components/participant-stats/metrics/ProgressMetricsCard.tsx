
import React from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { ProgressMetrics } from '@/utils/participantStats/types';
import MetricCard from './MetricCard';

interface ProgressMetricsCardProps {
  metrics: ProgressMetrics;
}

const ProgressMetricsCard: React.FC<ProgressMetricsCardProps> = ({ metrics }) => {
  const improvementIcon = metrics.improvement >= 0 ? TrendingUp : TrendingDown;
  const improvementColor = metrics.improvement >= 0 ? "text-green-500" : "text-red-500";
  
  return (
    <MetricCard title="Progression" icon={TrendingUp}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tendance de progression</span>
          <div className={`flex items-center gap-1 font-medium ${improvementColor}`}>
            {React.createElement(improvementIcon, { size: 16 })}
            {Math.abs(metrics.improvement).toFixed(1)}% {metrics.improvement >= 0 ? "d'amélioration" : "de régression"}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Meilleur score</span>
          <div className="flex items-center gap-1 font-medium text-green-500">
            <Award size={16} />
            {metrics.bestScore}/20
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Score le plus bas</span>
          <div className="flex items-center gap-1 font-medium text-amber-500">
            <AlertTriangle size={16} />
            {metrics.worstScore}/20
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Amélioration globale</span>
          <div className={`font-medium ${metrics.firstToLastImprovement >= 0 ? "text-green-500" : "text-red-500"}`}>
            {metrics.firstToLastImprovement > 0 ? "+" : ""}{metrics.firstToLastImprovement} points
          </div>
        </div>
      </div>
    </MetricCard>
  );
};

export default ProgressMetricsCard;
