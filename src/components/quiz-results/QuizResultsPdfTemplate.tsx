
import React from 'react';
import { QuizResult, Question } from '@/context/QuizContext';
import ParticipantInfo from './ParticipantInfo';
import QuizAnswerList from './QuizAnswerList';
import { format } from 'date-fns';

interface QuizResultsPdfTemplateProps {
  result: QuizResult;
  questionsMap: Record<string, Question>;
  metrics: {
    scoreOn20: number;
    successRate: number;
    durationInSeconds: number;
  };
}

const QuizResultsPdfTemplate: React.FC<QuizResultsPdfTemplateProps> = ({ 
  result, 
  questionsMap, 
  metrics 
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header with logo and title */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Résultats du quiz</h1>
          <h2 className="text-xl text-gray-700">{result.quizTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Date: {format(result.endTime, 'dd/MM/yyyy à HH:mm')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-brand-red">{metrics.scoreOn20.toFixed(1)}<span className="text-xl">/20</span></div>
          <div className="text-sm text-gray-600">
            {result.totalPoints}/{result.maxPoints} points
          </div>
        </div>
      </div>

      {/* Participant Information and Score Summary */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <ParticipantInfo participant={result.participant} />
        </div>
        
        <div className="bg-brand-lightgray rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-3">Résumé des résultats</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Note:</span>
              <span className="font-medium">{metrics.scoreOn20.toFixed(1)}/20</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taux de réussite:</span>
              <span className="font-medium">{metrics.successRate}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Temps total:</span>
              <span className="font-medium">{formatDuration(metrics.durationInSeconds)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Points:</span>
              <span className="font-medium">{result.totalPoints}/{result.maxPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Detail */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Détail des réponses</h3>
        <QuizAnswerList 
          answers={result.answers}
          questionsMap={questionsMap}
        />
      </div>
      
      {/* Footer */}
      <div className="mt-12 pt-4 border-t text-center text-sm text-gray-500">
        Document généré le {format(new Date(), 'dd/MM/yyyy à HH:mm')}
      </div>
    </div>
  );
};

export default QuizResultsPdfTemplate;
