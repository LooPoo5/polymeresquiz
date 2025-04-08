
import React from 'react';
import { QuizResult, Question } from '@/context/QuizContext';
import PdfHeader from './pdf-template/PdfHeader';
import ParticipantInfoCard from './pdf-template/ParticipantInfoCard';
import ResultsSummaryCard from './pdf-template/ResultsSummaryCard';
import AnswersList from './pdf-template/AnswersList';
import PdfFooter from './pdf-template/PdfFooter';

interface QuizResultsPdfTemplateProps {
  result: QuizResult;
  questionsMap: Record<string, Question>;
  metrics: {
    scoreOn20: number;
    successRate: number;
    durationInSeconds: number;
  };
  version?: number;
}

const QuizResultsPdfTemplate: React.FC<QuizResultsPdfTemplateProps> = ({ 
  result, 
  questionsMap, 
  metrics,
  version
}) => {
  // Numéro de version pour éviter les problèmes de cache
  const versionId = version || new Date().getTime();

  return (
    <div className="pdf-container max-w-4xl mx-auto p-4" style={{ 
      fontFamily: 'Arial, sans-serif',
      color: 'black',
      backgroundColor: 'white' 
    }}>
      {/* Version tracking pour le debug */}
      <div style={{ fontSize: '6px', color: '#ccc' }}>v{versionId}</div>

      {/* En-tête */}
      <PdfHeader result={result} metrics={metrics} />

      {/* Informations du participant et résumé */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '12px',
        fontSize: '12px'
      }}>
        <ParticipantInfoCard participant={result.participant} />
        <ResultsSummaryCard 
          scoreOn20={metrics.scoreOn20}
          successRate={metrics.successRate}
          durationInSeconds={metrics.durationInSeconds}
          totalPoints={result.totalPoints}
          maxPoints={result.maxPoints}
        />
      </div>

      {/* Détail des réponses */}
      <AnswersList 
        answers={result.answers} 
        questionsMap={questionsMap} 
      />
      
      {/* Pied de page */}
      <PdfFooter />
    </div>
  );
};

export default QuizResultsPdfTemplate;
