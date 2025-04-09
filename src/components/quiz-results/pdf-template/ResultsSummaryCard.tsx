
import React from 'react';
import { PdfMetrics } from './types';
import { formatDuration } from '@/utils/timeUtils';

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

// Helper component for each summary item
const SummaryItem: React.FC<{label: string; value: string}> = ({ label, value }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    marginBottom: '4px'
  }}>
    <span style={{ color: '#666' }}>{label}</span>
    <span style={{ color: 'black' }}>{value}</span>
  </div>
);

export default ResultsSummaryCard;
