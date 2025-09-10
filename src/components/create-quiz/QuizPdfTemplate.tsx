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
          padding: '40px',
          backgroundColor: 'white',
          maxWidth: '210mm',
          minHeight: '297mm',
          fontFamily: 'Arial, sans-serif',
          color: 'black',
          fontSize: '12px',
          lineHeight: '1.4'
        }}
      >
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0', color: 'black' }}>
            {title || 'Quiz sans titre'}
          </h1>
          
          {imageUrl && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={imageUrl} 
                alt={title} 
                style={{ maxHeight: '128px', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Information du participant */}
        <div style={{ 
          marginBottom: '32px', 
          borderTop: '1px solid #d1d5db', 
          borderBottom: '1px solid #d1d5db', 
          paddingTop: '24px', 
          paddingBottom: '24px' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  Nom du participant
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  height: '40px', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 12px',
                  backgroundColor: 'white'
                }}>
                  {participantName || ''}
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  Date
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  height: '40px', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 12px',
                  backgroundColor: 'white'
                }}>
                  {participantDate || ''}
                </div>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  Formateur
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  height: '40px', 
                  width: '100%',
                  backgroundColor: 'white'
                }}></div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '4px' 
                }}>
                  Signature
                </label>
                <div style={{ 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  height: '96px', 
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
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '24px',
            color: 'black'
          }}>
            Questions
          </h2>
          
          {questions.length === 0 ? (
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '16px', 
              textAlign: 'center', 
              color: '#6b7280',
              backgroundColor: 'white'
            }}>
              Aucune question ajoutée pour l'instant
            </div>
          ) : (
            questions.map((question, questionIndex) => (
              <div key={question.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '24px',
                backgroundColor: 'white',
                pageBreakInside: 'avoid'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: '500', color: 'black', margin: '0' }}>
                    Question {questionIndex + 1}: {question.text}
                  </p>
                  {question.imageUrl && (
                    <div style={{ margin: '8px 0' }}>
                      <img 
                        src={question.imageUrl} 
                        alt={`Image pour question ${questionIndex + 1}`}
                        style={{ maxHeight: '160px', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
                
                {question.type === 'multiple-choice' && (
                  <div style={{ paddingLeft: '16px' }}>
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answer.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <div style={{ 
                          height: '16px', 
                          width: '16px', 
                          border: '1px solid #9ca3af', 
                          borderRadius: '50%', 
                          marginRight: '8px',
                          backgroundColor: 'white'
                        }}></div>
                        <span style={{ color: 'black' }}>{answer.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'checkbox' && (
                  <div style={{ paddingLeft: '16px' }}>
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answer.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <div style={{ 
                          height: '16px', 
                          width: '16px', 
                          border: '1px solid #9ca3af', 
                          marginRight: '8px',
                          backgroundColor: 'white'
                        }}></div>
                        <span style={{ color: 'black' }}>{answer.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'open-ended' && (
                  <div style={{ 
                    marginTop: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px', 
                    height: '96px', 
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