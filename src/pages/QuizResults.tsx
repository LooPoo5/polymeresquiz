
import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Custom hook and utilities
import { useQuizResult } from '@/hooks/useQuizResult';
import { generatePDFFromComponent } from '@/utils/pdf';

// Components
import ParticipantInfo from '@/components/quiz-results/ParticipantInfo';
import ScoreSummary from '@/components/quiz-results/ScoreSummary';
import PdfControls from '@/components/quiz-results/PdfControls';
import ResultsLoadingState from '@/components/quiz-results/ResultsLoadingState';
import QuizAnswerList from '@/components/quiz-results/QuizAnswerList';
import QuizResultsPdfTemplate from '@/components/quiz-results/QuizResultsPdfTemplate';

const QuizResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook to fetch and process the quiz result
  const { result, quizQuestions, metrics } = useQuizResult(id);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!result || !metrics) return;
    
    // Format date for filename (change from DD/MM/YYYY to DD-MM-YYYY)
    const formattedDate = result.participant.date.replace(/\//g, '-');
    
    // Format the filename: QuizTitle-Date-ParticipantName
    const filename = `${result.quizTitle.replace(/\s+/g, '-')}-${formattedDate}-${result.participant.name.replace(/\s+/g, '-')}.pdf`;
    
    // Use the PDF generation method with the dedicated template
    generatePDFFromComponent(
      <QuizResultsPdfTemplate 
        result={result} 
        questionsMap={quizQuestions}
        metrics={metrics}
      />,
      filename,
      () => setGeneratingPdf(true),
      () => setGeneratingPdf(false),
      () => setGeneratingPdf(false)
    );
  };

  if (!result || !metrics) {
    return <ResultsLoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate('/results')} 
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors print:hidden"
      >
        <ArrowLeft size={18} />
        <span>Retour aux résultats</span>
      </button>
      
      <div ref={pdfRef} id="quiz-pdf-content" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-6 print:mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Résultats du quiz</h1>
            <h2 className="text-xl">{result.quizTitle}</h2>
          </div>
          
          <PdfControls 
            onPrint={handlePrint} 
            onDownloadPDF={handleDownloadPDF}
            isGenerating={generatingPdf}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 page-break-inside-avoid">
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
          <h3 className="text-lg font-semibold mb-4">Détail des réponses</h3>
          <QuizAnswerList 
            answers={result.answers}
            questionsMap={quizQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
