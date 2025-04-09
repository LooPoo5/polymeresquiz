
import React from 'react';
import PdfHeader from './pdf-template/PdfHeader';
import ParticipantInfoCard from './pdf-template/ParticipantInfoCard';
import ResultsSummaryCard from './pdf-template/ResultsSummaryCard';
import AnswersList from './pdf-template/AnswersList';
import PdfFooter from './pdf-template/PdfFooter';
import { PdfTemplateProps } from './pdf-template/types';

const QuizResultsPdfTemplate: React.FC<PdfTemplateProps> = ({ 
  result, 
  questionsMap, 
  metrics,
  version
}) => {
  // Version ID for cache busting
  const versionId = version || Date.now();

  return (
    <div className="pdf-container max-w-4xl mx-auto p-4" style={{ 
      fontFamily: 'Arial, sans-serif',
      color: 'black',
      backgroundColor: 'white' 
    }}>
      {/* Version tracking for debugging */}
      <div style={{ fontSize: '6px', color: '#ccc' }}>v{versionId}</div>

      {/* Header */}
      <PdfHeader result={result} metrics={metrics} />

      {/* Participant information and results summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '12px',
        fontSize: '12px'
      }}>
        <ParticipantInfoCard participant={result.participant} />
        <ResultsSummaryCard 
          metrics={metrics}
          totalPoints={result.totalPoints}
          maxPoints={result.maxPoints}
        />
      </div>

      {/* Answers detail */}
      <AnswersList 
        answers={result.answers} 
        questionsMap={questionsMap} 
      />
      
      {/* Footer */}
      <PdfFooter />
    </div>
  );
};

export default QuizResultsPdfTemplate;
