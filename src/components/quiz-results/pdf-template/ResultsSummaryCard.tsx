
import React from 'react';

interface ResultsSummaryCardProps {
  scoreOn20: number;
  successRate: number;
  durationInSeconds: number;
  totalPoints: number;
  maxPoints: number;
}

const ResultsSummaryCard: React.FC<ResultsSummaryCardProps> = ({ 
  scoreOn20, 
  successRate, 
  durationInSeconds, 
  totalPoints, 
  maxPoints 
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '4px'
        }}>
          <span style={{ color: '#666' }}>Note:</span>
          <span style={{ color: 'black' }}>{scoreOn20.toFixed(1)}/20</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '4px'
        }}>
          <span style={{ color: '#666' }}>Taux de réussite:</span>
          <span style={{ color: 'black' }}>{successRate}%</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '4px'
        }}>
          <span style={{ color: '#666' }}>Temps total:</span>
          <span style={{ color: 'black' }}>{formatDuration(durationInSeconds)}</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '4px'
        }}>
          <span style={{ color: '#666' }}>Points:</span>
          <span style={{ color: 'black' }}>{totalPoints}/{maxPoints}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummaryCard;
