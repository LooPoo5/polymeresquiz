
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Custom hook and components
import { useQuizResult } from '@/hooks/useQuizResult';
import ParticipantInfo from '@/components/quiz-results/ParticipantInfo';
import ScoreSummary from '@/components/quiz-results/ScoreSummary';
import PdfControls from '@/components/quiz-results/PdfControls';
import ResultsLoadingState from '@/components/quiz-results/ResultsLoadingState';
import QuizAnswerList from '@/components/quiz-results/QuizAnswerList';

const QuizResults = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { result, quizQuestions, metrics } = useQuizResult(id);
  
  const handlePrint = () => {
    if (!result) return;
    
    // Set the document title for the print dialog
    const originalTitle = document.title;
    document.title = `${result.participant.name} ${result.participant.date} ${result.quizTitle}`;
    
    // Print the document
    window.print();
    
    // Restore the original title
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  if (!result || !metrics) {
    return <ResultsLoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate('/results')} 
          className="flex items-center gap-2 text-gray-600 hover:text-brand-red transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Retour aux résultats</span>
        </button>
      </div>
      
      <div id="quiz-pdf-content" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Résultats du quiz</h1>
            <p className="text-gray-600">{result.quizTitle}</p>
          </div>
          
          <PdfControls 
            onPrint={handlePrint}
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
    </div>
  );
};

export default QuizResults;
