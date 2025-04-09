
import React from 'react';
import AnswerOption from './AnswerOption';
import { Question } from '@/context/QuizContext';

interface AnswerItemProps {
  question: Question;
  answer: any;
  index: number;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ question, answer, index }) => {
  return (
    <div style={{ 
      marginBottom: '5px',
      borderBottom: '1px solid #eaeaea',
      paddingBottom: '5px'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            fontWeight: '500',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between',
            color: 'black',
            margin: '2px 0'
          }}>
            <span>Q{index + 1}: {question.text}</span>
            <span style={{ marginLeft: '4px' }}>
              {answer.points}/{question.points || 1}
            </span>
          </h4>
          
          {question.imageUrl && (
            <div style={{ margin: '3px 0' }}>
              <img 
                src={question.imageUrl} 
                alt={`Question ${index + 1}`} 
                style={{ 
                  maxHeight: '48px', 
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
        fontSize: '10px',
        marginLeft: '6px'
      }}>
        {question.type === 'open-ended' ? (
          <div>
            <div style={{ 
              fontWeight: '500',
              marginBottom: '2px',
              color: 'black',
              fontSize: '10px' // Match the font size of the answers
            }}>Réponse :</div>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '3px',
              padding: '2px',
              border: '1px solid #eaeaea',
              fontSize: '10px'
            }}>
              {answer.answerText || "Sans réponse"}
            </div>
          </div>
        ) : (
          <>
            <div style={{ 
              fontWeight: '500',
              marginBottom: '2px',
              color: 'black',
              fontSize: '10px' // Match the font size of the answers
            }}>Réponses :</div>
            {question.answers.map(option => {
              const isSelected = answer.answerIds
                ? answer.answerIds.includes(option.id)
                : answer.answerId === option.id;
              
              return (
                <AnswerOption 
                  key={option.id}
                  text={option.text}
                  isSelected={isSelected}
                  isCorrect={option.isCorrect}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default AnswerItem;
