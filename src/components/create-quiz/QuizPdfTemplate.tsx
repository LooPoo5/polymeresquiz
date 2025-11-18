import React, { forwardRef } from 'react';
import SignatureSection from '@/components/quiz/SignatureSection';
import { Question } from '@/context/QuizContext';

type QuizPdfTemplateProps = {
  title: string;
  imageUrl?: string;
  questions: Question[];
  participantName?: string;
  participantDate?: string;
};

const QuizPdfTemplate = forwardRef<HTMLDivElement, QuizPdfTemplateProps>(
  ({ title, imageUrl, questions, participantName, participantDate }, ref) => {
    return (
      <div 
        ref={ref} 
        style={{
          padding: '15px',
          backgroundColor: 'white',
          maxWidth: '210mm',
          minHeight: '297mm',
          fontFamily: 'Arial, sans-serif',
          color: 'black',
          fontSize: '11px',
          lineHeight: '1.3'
        }}
      >
        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'black' }}>
            {title || 'Quiz sans titre'}
          </h1>
          
          {imageUrl && (
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={imageUrl} 
                alt={title} 
                style={{ maxHeight: '100px', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Information du participant */}
        <div style={{ 
          marginBottom: '12px', 
          borderTop: '1px solid #d1d5db', 
          borderBottom: '1px solid #d1d5db', 
          paddingTop: '8px', 
          paddingBottom: '8px' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '11px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '2px' 
                }}>
                  Nom du participant
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '3px', 
                  height: '28px', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 8px',
                  backgroundColor: 'white'
                }}>
                  {participantName || ''}
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '11px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '2px' 
                }}>
                  Date
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '3px', 
                  height: '28px', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 8px',
                  backgroundColor: 'white'
                }}>
                  {participantDate || ''}
                </div>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '11px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '2px' 
                }}>
                  Formateur
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '3px', 
                  height: '28px', 
                  width: '100%',
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 8px',
                  backgroundColor: 'white'
                }}></div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '11px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '2px' 
                }}>
                  Signature du participant
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '3px', 
                  height: '60px', 
                  width: '100%',
                  backgroundColor: 'white'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div>
          <h2 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: 'black'
          }}>
            Questions
          </h2>
          
          {questions.length === 0 ? (
            <div style={{ 
              padding: '8px', 
              textAlign: 'center', 
              color: '#6b7280',
              backgroundColor: 'white'
            }}>
              Aucune question ajoutée pour l'instant
            </div>
          ) : (
            questions.map((question, questionIndex) => (
              <div key={question.id} style={{ 
                marginBottom: '12px',
                backgroundColor: 'white',
                pageBreakInside: 'avoid'
              }}>
                <div style={{ marginBottom: '6px' }}>
                  <p style={{ fontWeight: '600', color: 'black', margin: '0 0 4px 0', fontSize: '12px' }}>
                    {questionIndex + 1}. {question.text}
                  </p>
                  {question.imageUrl && (
                    <div style={{ margin: '4px 0' }}>
                      <img 
                        src={question.imageUrl} 
                        alt={`Image pour question ${questionIndex + 1}`}
                        style={{ maxHeight: '120px', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
                
                {question.type === 'multiple-choice' && (
                  <div style={{ paddingLeft: '8px' }}>
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answer.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <div style={{ 
                          height: '14px', 
                          width: '14px', 
                          border: '1px solid #9ca3af', 
                          borderRadius: '50%', 
                          marginRight: '6px',
                          backgroundColor: 'white',
                          flexShrink: 0
                        }}></div>
                        <span style={{ color: 'black', fontSize: '11px' }}>{answer.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'checkbox' && (
                  <div style={{ paddingLeft: '8px' }}>
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answer.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <div style={{ 
                          height: '14px', 
                          width: '14px', 
                          border: '1px solid #9ca3af', 
                          marginRight: '6px',
                          backgroundColor: 'white',
                          flexShrink: 0
                        }}></div>
                        <span style={{ color: 'black', fontSize: '11px' }}>{answer.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'open-ended' && (
                  <div style={{ 
                    marginTop: '4px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '3px', 
                    height: '70px', 
                    width: '100%',
                    backgroundColor: 'white'
                  }}></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

QuizPdfTemplate.displayName = 'QuizPdfTemplate';

export default QuizPdfTemplate;