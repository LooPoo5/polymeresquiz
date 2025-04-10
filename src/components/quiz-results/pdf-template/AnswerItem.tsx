
import React from 'react';
import AnswerOption from './AnswerOption';
import { Question } from '@/context/types';
import { PdfAnswerItem } from './types';

interface AnswerItemProps {
  question: Question;
  answer: PdfAnswerItem;
  index: number;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ question, answer, index }) => {
  // Calculate the total possible points for the question
  const totalPossiblePoints = getTotalPossiblePoints(question);
  
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
              {answer.points}/{totalPossiblePoints}
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
        {renderAnswerContent(question, answer)}
      </div>
    </div>
  );
};

// Helper function to get total possible points for a question
const getTotalPossiblePoints = (question: Question): number => {
  if (question.type === 'open-ended') {
    return question.points || 1;
  } else if (question.type === 'multiple-choice') {
    const correctAnswer = question.answers.find(a => a.isCorrect);
    return correctAnswer?.points || question.points || 1;
  } else {
    const correctAnswersPoints = question.answers
      .filter(a => a.isCorrect)
      .reduce((sum, a) => sum + (a.points || 1), 0);
    return correctAnswersPoints > 0 ? correctAnswersPoints : question.points || 1;
  }
};

// Helper function to render the appropriate content based on question type
const renderAnswerContent = (question: Question, answer: PdfAnswerItem) => {
  if (question.type === 'open-ended') {
    return (
      <div>
        <div style={{ 
          fontWeight: '500',
          marginBottom: '2px',
          color: 'black',
          fontSize: '10px'
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
    );
  }
  
  return (
    <>
      <div style={{ 
        fontWeight: '500',
        marginBottom: '2px',
        color: 'black',
        fontSize: '10px'
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
            points={option.points}
          />
        );
      })}
    </>
  );
};

export default AnswerItem;
