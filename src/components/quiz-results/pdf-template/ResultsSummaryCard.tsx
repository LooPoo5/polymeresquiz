
import React from 'react';
import { PdfMetrics } from './types';
import { formatDuration } from '@/utils/timeUtils';
import SummaryItem from './SummaryItem';

interface ResultsSummaryCardProps {
  metrics: PdfMetrics;
  totalPoints: number;
  maxPoints: number;
}

const ResultsSummaryCard: React.FC<ResultsSummaryCardProps> = ({ 
  metrics, 
  totalPoints, 
  maxPoints 
}) => {
  return (
    <div style={{ 
      padding: '8px',
      border: '1px solid #eaeaea',
      borderRadius: '4px'
    }}>
      <h3 style={{ 
        fontWeight: '600', 
        marginBottom: '4px',
        color: 'black',
        fontSize: '14px'
      }}>Résumé des résultats</h3>
      
      <div style={{ marginTop: '4px' }}>
        <SummaryItem label="Note:" value={`${metrics.scoreOn20.toFixed(1)}/20`} />
        <SummaryItem label="Taux de réussite:" value={`${metrics.successRate}%`} />
        <SummaryItem label="Temps total:" value={formatDuration(metrics.durationInSeconds)} />
        <SummaryItem label="Points:" value={`${totalPoints}/${maxPoints}`} />
      </div>
    </div>
  );
};

export default ResultsSummaryCard;
