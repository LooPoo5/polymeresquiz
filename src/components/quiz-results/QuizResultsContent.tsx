
import React from 'react';
import { QuizResult } from '@/context/QuizContext';
import { Question } from '@/context/types';
import ParticipantInfo from './ParticipantInfo';
import ScoreSummary from './ScoreSummary';
import QuizAnswerList from './QuizAnswerList';
import PdfControls from './PdfControls';
import { PdfMetrics } from './pdf-template/types';

interface QuizResultsContentProps {
  result: QuizResult;
  quizQuestions: Record<string, Question>;
  metrics: PdfMetrics;
  onPrint: () => void;
  onDownloadPDF: () => void;
  isGenerating: boolean;
}

const QuizResultsContent = ({
  result,
  quizQuestions,
  metrics,
  onPrint,
  onDownloadPDF,
  isGenerating
}: QuizResultsContentProps) => {
  return (
    <div id="quiz-pdf-content" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Résultats du quiz</h1>
          <p className="text-gray-600">{result.quizTitle}</p>
        </div>
        
        <PdfControls 
          onPrint={onPrint}
          onDownloadPDF={onDownloadPDF}
          isGenerating={isGenerating}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ParticipantInfo participant={result.participant} />
        
        <ScoreSummary
          scoreOn20={metrics.scoreOn20}
          successRate={metrics.successRate}
          durationInSeconds={metrics.durationInSeconds}
          totalPoints={result.totalPoints}
          maxPoints={result.maxPoints}
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Détail des réponses</h2>
        <QuizAnswerList 
          answers={result.answers}
          questionsMap={quizQuestions}
        />
      </div>
    </div>
  );
};

export default QuizResultsContent;
