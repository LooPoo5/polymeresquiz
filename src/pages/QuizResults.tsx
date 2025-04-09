
import React, { useState } from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import usePrintDocument from '@/hooks/usePrintDocument';
import BackNavigation from '@/components/quiz-results/BackNavigation';
import QuizResultsContent from '@/components/quiz-results/QuizResultsContent';
import ResultsLoadingState from '@/components/quiz-results/ResultsLoadingState';
import { generateQuizResultsPdfWithPdfmake } from '@/utils/pdf/pdfmakeGenerator';

const QuizResults = () => {
  const { result, quizQuestions, metrics } = useQuizResult();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Set up document printing
  const handlePrint = usePrintDocument({
    documentTitle: result 
      ? `${result.participant.name} ${result.participant.date} ${result.quizTitle}`
      : undefined
  });

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!result || !quizQuestions || !metrics) return;
    
    await generateQuizResultsPdfWithPdfmake(
      result,
      quizQuestions,
      metrics,
      setIsGenerating
    );
  };

  // Show loading state while data is being fetched
  if (!result || !metrics) {
    return <ResultsLoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackNavigation />
      
      <QuizResultsContent 
        result={result}
        quizQuestions={quizQuestions}
        metrics={metrics}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default QuizResults;
