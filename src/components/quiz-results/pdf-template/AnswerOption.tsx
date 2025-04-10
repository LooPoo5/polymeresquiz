
import React from 'react';
import { AnswerOptionProps } from './types';

const AnswerOption: React.FC<AnswerOptionProps> = ({ text, isSelected, isCorrect, points }) => {
  // Determine the color based on selection and correctness
  let textColor = 'black';
  
  if (isSelected && isCorrect) {
    textColor = '#047857'; // green for correct and selected
  } else if (isSelected && !isCorrect) {
    textColor = '#dc2626'; // red for incorrect and selected
  } else if (!isSelected && isCorrect) {
    textColor = '#F97316'; // orange for correct but not selected
  }
  
  // Add points display for correct answers
  const pointsText = isCorrect && points ? ` (${points} pt${points > 1 ? 's' : ''})` : '';
  
  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        marginBottom: '2px',
        color: textColor,
        fontSize: '10px'
      }}
    >
      <span style={{ 
        display: 'inline-block',
        width: '10px',
        textAlign: 'center'
      }}>
        {isSelected ? '✓' : '○'}
      </span>
      <span>{text}{pointsText}</span>
    </div>
  );
};

export default AnswerOption;
