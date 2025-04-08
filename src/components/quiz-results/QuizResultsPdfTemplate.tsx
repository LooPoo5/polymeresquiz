
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
    <div className="pdf-container max-w-4xl mx-auto p-4" style={{ 
      fontFamily: 'Arial, sans-serif',
      color: 'black',
      backgroundColor: 'white' 
    }}>
      {/* Version tracking pour le debug */}
      <div style={{ fontSize: '6px', color: '#ccc' }}>v{versionId}</div>

      {/* En-tête */}
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

      {/* Informations du participant et résumé */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '12px',
        fontSize: '12px'
      }}>
        <div style={{ 
          padding: '8px',
          border: '1px solid #eaeaea',
          borderRadius: '4px'
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            marginBottom: '4px',
            color: 'black',
            fontSize: '14px'
          }}>Informations du participant</h3>
          
          <div style={{ marginTop: '4px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ color: '#666' }}>Nom:</span>
              <span style={{ color: 'black' }}>{result.participant.name}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ color: '#666' }}>Date:</span>
              <span style={{ color: 'black' }}>{result.participant.date}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ color: '#666' }}>Formateur:</span>
              <span style={{ color: 'black' }}>{result.participant.instructor}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '8px' }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#666',
              marginBottom: '4px'
            }}>Signature:</div>
            <div style={{ 
              height: '64px',
              width: '160px',
              border: '1px solid #eaeaea',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}>
              {result.participant.signature && (
                <img 
                  src={result.participant.signature} 
                  alt="Signature" 
                  style={{ 
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain'
                  }}
                  crossOrigin="anonymous"
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Résumé optimisé pour l'impression */}
        <div style={{ 
          padding: '8px',
          border: '1px solid #eaeaea',
          borderRadius: '4px'
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            marginBottom: '4px',
            color: 'black',
            fontSize: '14px'
          }}>Résumé des résultats</h3>
          
          <div style={{ marginTop: '4px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ color: '#666' }}>Note:</span>
              <span style={{ color: 'black' }}>{metrics.scoreOn20.toFixed(1)}/20</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ color: '#666' }}>Taux de réussite:</span>
              <span style={{ color: 'black' }}>{metrics.successRate}%</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ color: '#666' }}>Temps total:</span>
              <span style={{ color: 'black' }}>{formatDuration(metrics.durationInSeconds)}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ color: '#666' }}>Points:</span>
              <span style={{ color: 'black' }}>{result.totalPoints}/{result.maxPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Détail des réponses */}
      <div style={{ 
        marginBottom: '12px',
        border: '1px solid #eaeaea',
        borderRadius: '4px',
        padding: '8px'
      }}>
        <h3 style={{ 
          fontWeight: '600',
          fontSize: '14px',
          paddingBottom: '4px',
          marginBottom: '8px',
          borderBottom: '1px solid #eaeaea',
          color: 'black'
        }}>
          Détail des réponses
        </h3>
        <div>
          {result.answers.map((answer, index) => {
            const question = questionsMap[answer.questionId];
            if (!question) return null;
            
            // Pour la vérification de isCorrect
            const isCorrect = answer.isCorrect;
            
            return (
              <div key={answer.questionId} style={{ 
                marginBottom: '8px',
                borderBottom: '1px solid #eaeaea',
                paddingBottom: '8px'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontWeight: '500',
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: 'black'
                    }}>
                      <span>Q{index + 1}: {question.text}</span>
                      <span style={{ marginLeft: '4px' }}>
                        {answer.points}/{question.points || 1}
                      </span>
                    </h4>
                    
                    {question.imageUrl && (
                      <div style={{ margin: '4px 0' }}>
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
                
                <div style={{ 
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  {question.type === 'open-ended' ? (
                    <div>
                      <div style={{ 
                        fontWeight: '500',
                        marginBottom: '4px',
                        color: 'black'
                      }}>Réponse :</div>
                      <div style={{ 
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        padding: '4px',
                        border: '1px solid #eaeaea'
                      }}>
                        {answer.answerText || "Sans réponse"}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ 
                        fontWeight: '500',
                        marginBottom: '4px',
                        color: 'black'
                      }}>Réponses :</div>
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
                            style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginBottom: '4px',
                              color: textColor
                            }}
                          >
                            <span style={{ 
                              display: 'inline-block',
                              width: '12px',
                              textAlign: 'center'
                            }}>
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
      
      {/* Pied de page */}
      <div style={{ 
        textAlign: 'center',
        fontSize: '12px',
        color: '#666',
        paddingTop: '4px',
        borderTop: '1px solid #eaeaea'
      }}>
        Document généré le {format(new Date(), 'dd/MM/yyyy à HH:mm')}
      </div>
    </div>
  );
};

export default QuizResultsPdfTemplate;
