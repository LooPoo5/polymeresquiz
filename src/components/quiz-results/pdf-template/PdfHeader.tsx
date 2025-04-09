
import React from 'react';
import { format } from 'date-fns';
import { QuizResult } from '@/context/types';
import { PdfMetrics } from './types';

interface PdfHeaderProps {
  result: QuizResult;
  metrics: PdfMetrics;
}

const PdfHeader: React.FC<PdfHeaderProps> = ({ result, metrics }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingBottom: '8px',
      marginBottom: '12px',
      borderBottom: '1px solid #eaeaea'
    }}>
      <div>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: 'black',
          margin: '0 0 4px 0'
        }}>Résultats du quiz</h1>
        <h2 style={{ 
          fontSize: '16px',
          color: 'black',
          margin: '0 0 4px 0'
        }}>{result.quizTitle}</h2>
        <p style={{ 
          fontSize: '12px',
          color: '#666',
          margin: '0'
        }}>
          Date: {format(result.endTime, 'dd/MM/yyyy à HH:mm')}
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#e53e3e'
        }}>{metrics.scoreOn20.toFixed(1)}/20</div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666'
        }}>
          {result.totalPoints}/{result.maxPoints} points
        </div>
      </div>
    </div>
  );
};

export default PdfHeader;
