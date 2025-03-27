
import React from 'react';
import { Activity, BarChart } from 'lucide-react';
import { ConsistencyMetrics } from '@/utils/participantStats/types';
import MetricCard from './MetricCard';

interface ConsistencyMetricsCardProps {
  metrics: ConsistencyMetrics;
}

const ConsistencyMetricsCard: React.FC<ConsistencyMetricsCardProps> = ({ metrics }) => {
  // Determine consistency level text and color
  let consistencyLevel = "Excellent";
  let consistencyColor = "text-green-500";
  
  if (metrics.consistencyScore < 50) {
    consistencyLevel = "Faible";
    consistencyColor = "text-red-500";
  } else if (metrics.consistencyScore < 75) {
    consistencyLevel = "Moyen";
    consistencyColor = "text-amber-500";
  } else if (metrics.consistencyScore < 90) {
    consistencyLevel = "Bon";
    consistencyColor = "text-blue-500";
  }
  
  return (
    <MetricCard title="Constance" icon={Activity}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Indice de constance</span>
            <span className={`font-medium ${consistencyColor}`}>{consistencyLevel}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                metrics.consistencyScore >= 90 ? "bg-green-500" :
                metrics.consistencyScore >= 75 ? "bg-blue-500" :
                metrics.consistencyScore >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, metrics.consistencyScore))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Variable</span>
            <span>Constant</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Variance des scores</span>
          <span className="font-medium">{metrics.scoreVariance.toFixed(1)} points²</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Écart moyen</span>
          <span className="font-medium">±{metrics.averageDeviation.toFixed(1)} points</span>
        </div>
      </div>
    </MetricCard>
  );
};

export default ConsistencyMetricsCard;
