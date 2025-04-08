
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

  // Numéro de version pour éviter les problèmes de cache
  const version = new Date().getTime();

  return (
    <div className="pdf-container max-w-4xl mx-auto p-2 bg-white text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Version tracking pour le debug */}
      <div className="text-[6px] text-gray-300">v{version}</div>

      {/* Compact Header */}
      <div className="flex justify-between items-center pb-1 mb-2">
        <div>
          <h1 className="text-xl font-bold">Résultats du quiz</h1>
          <h2 className="text-base">{result.quizTitle}</h2>
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
      <div className="grid grid-cols-2 gap-2 mb-2 text-xs page-break-inside-avoid">
        <div className="p-1">
          <h3 className="font-semibold mb-0.5">Informations du participant</h3>
          
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <span className="text-gray-600">Nom:</span>
              <span>{result.participant.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{result.participant.date}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Formateur:</span>
              <span>{result.participant.instructor}</span>
            </div>
          </div>
          
          <div className="mt-0.5">
            <div className="text-xs text-gray-600 mb-0.5">Signature:</div>
            <div className="h-10 w-32 bg-white">
              {result.participant.signature && <img src={result.participant.signature} alt="Signature" className="h-full object-contain" />}
            </div>
          </div>
        </div>
        
        {/* Print-friendly summary metrics */}
        <div className="p-1">
          <h3 className="font-semibold mb-0.5">Résumé des résultats</h3>
          
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <span className="text-gray-600">Note:</span>
              <span>{metrics.scoreOn20.toFixed(1)}/20</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taux de réussite:</span>
              <span>{metrics.successRate}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Temps total:</span>
              <span>{formatDuration(metrics.durationInSeconds)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Points:</span>
              <span>{result.totalPoints}/{result.maxPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Detail - with strict page break control */}
      <div className="mb-2">
        <h3 className="font-semibold text-xs pb-0.5 mb-1">Détail des réponses</h3>
        <div>
          {result.answers.map((answer, index) => {
            const question = questionsMap[answer.questionId];
            if (!question) return null;
            
            // For isCorrect checking
            const isCorrect = answer.isCorrect;
            
            return (
              <div key={answer.questionId} className="question-answer-item mb-1 page-break-inside-avoid bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-xs flex justify-between">
                      <span>Q{index + 1}: {question.text}</span>
                      <span className="ml-1">
                        {answer.points}/{question.points || 1}
                      </span>
                    </h4>
                    
                    {question.imageUrl && (
                      <div className="my-0.5">
                        <img 
                          src={question.imageUrl} 
                          alt={`Question ${index + 1}`} 
                          className="max-h-16 object-contain"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-[9px] space-y-0.5 ml-1">
                  {question.type === 'open-ended' ? (
                    <div>
                      <div className="font-medium">Réponse :</div>
                      <div className="bg-white rounded">
                        {answer.answerText || "Sans réponse"}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium">Réponses :</div>
                      {question.answers.map(option => {
                        const isSelected = answer.answerIds
                          ? answer.answerIds.includes(option.id)
                          : answer.answerId === option.id;
                        
                        return (
                          <div 
                            key={option.id} 
                            className={`flex items-center gap-1`}
                            style={{ 
                              color: isSelected 
                                ? (option.isCorrect ? '#047857' : '#dc2626') 
                                : 'inherit' 
                            }}
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
      <div className="text-center text-[8px] text-gray-500 pt-0.5">
        Document généré le {format(new Date(), 'dd/MM/yyyy à HH:mm')}
      </div>
    </div>
  );
};

export default QuizResultsPdfTemplate;
