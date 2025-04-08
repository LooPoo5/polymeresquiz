
import React from 'react';
import { QuizResult, Question } from '@/context/QuizContext';
import { format } from 'date-fns';

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
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Numéro de version pour éviter les problèmes de cache
  const versionId = version || new Date().getTime();

  return (
    <div className="pdf-container max-w-4xl mx-auto p-4 bg-white text-black" style={{ 
      fontFamily: 'Arial, sans-serif',
      color: 'black',
      backgroundColor: 'white' 
    }}>
      {/* Version tracking pour le debug */}
      <div className="text-[6px] text-gray-300">v{versionId}</div>

      {/* Compact Header */}
      <div className="flex justify-between items-center pb-2 mb-3 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'black' }}>Résultats du quiz</h1>
          <h2 className="text-base" style={{ color: 'black' }}>{result.quizTitle}</h2>
          <p className="text-xs text-gray-500">
            Date: {format(result.endTime, 'dd/MM/yyyy à HH:mm')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: '#e53e3e' }}>{metrics.scoreOn20.toFixed(1)}/20</div>
          <div className="text-xs text-gray-600">
            {result.totalPoints}/{result.maxPoints} points
          </div>
        </div>
      </div>

      {/* Compact Participant Information and Score Summary */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div className="p-2 border border-gray-200 rounded">
          <h3 className="font-semibold mb-1" style={{ color: 'black' }}>Informations du participant</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Nom:</span>
              <span style={{ color: 'black' }}>{result.participant.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span style={{ color: 'black' }}>{result.participant.date}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Formateur:</span>
              <span style={{ color: 'black' }}>{result.participant.instructor}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-xs text-gray-600 mb-1">Signature:</div>
            <div className="h-16 w-40 border border-gray-200 rounded bg-white">
              {result.participant.signature && (
                <img 
                  src={result.participant.signature} 
                  alt="Signature" 
                  className="h-full object-contain"
                  style={{ maxHeight: '64px' }}
                  crossOrigin="anonymous"
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Print-friendly summary metrics */}
        <div className="p-2 border border-gray-200 rounded">
          <h3 className="font-semibold mb-1" style={{ color: 'black' }}>Résumé des résultats</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Note:</span>
              <span style={{ color: 'black' }}>{metrics.scoreOn20.toFixed(1)}/20</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taux de réussite:</span>
              <span style={{ color: 'black' }}>{metrics.successRate}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Temps total:</span>
              <span style={{ color: 'black' }}>{formatDuration(metrics.durationInSeconds)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Points:</span>
              <span style={{ color: 'black' }}>{result.totalPoints}/{result.maxPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Detail */}
      <div className="mb-3 border border-gray-200 rounded p-2">
        <h3 className="font-semibold text-sm pb-1 mb-2 border-b border-gray-200" style={{ color: 'black' }}>
          Détail des réponses
        </h3>
        <div>
          {result.answers.map((answer, index) => {
            const question = questionsMap[answer.questionId];
            if (!question) return null;
            
            // For isCorrect checking
            const isCorrect = answer.isCorrect;
            
            return (
              <div key={answer.questionId} className="mb-2 border-b border-gray-200 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-xs flex justify-between" style={{ color: 'black' }}>
                      <span>Q{index + 1}: {question.text}</span>
                      <span className="ml-1">
                        {answer.points}/{question.points || 1}
                      </span>
                    </h4>
                    
                    {question.imageUrl && (
                      <div className="my-1">
                        <img 
                          src={question.imageUrl} 
                          alt={`Question ${index + 1}`} 
                          style={{ 
                            maxHeight: '64px', 
                            maxWidth: '100%', 
                            objectFit: 'contain' 
                          }}
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs space-y-1 ml-2">
                  {question.type === 'open-ended' ? (
                    <div>
                      <div className="font-medium" style={{ color: 'black' }}>Réponse :</div>
                      <div className="bg-white rounded p-1 border border-gray-200">
                        {answer.answerText || "Sans réponse"}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium" style={{ color: 'black' }}>Réponses :</div>
                      {question.answers.map(option => {
                        const isSelected = answer.answerIds
                          ? answer.answerIds.includes(option.id)
                          : answer.answerId === option.id;
                        
                        const textColor = isSelected 
                          ? (option.isCorrect ? '#047857' : '#dc2626') 
                          : 'black';
                        
                        return (
                          <div 
                            key={option.id} 
                            className="flex items-center gap-1"
                            style={{ color: textColor }}
                          >
                            <span className="inline-block w-3 text-center">
                              {isSelected ? '✓' : '○'}
                            </span>
                            <span>{option.text}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-xs text-gray-500 pt-1 border-t border-gray-200">
        Document généré le {format(new Date(), 'dd/MM/yyyy à HH:mm')}
      </div>
    </div>
  );
};

export default QuizResultsPdfTemplate;
