
import React from 'react';

interface AnswerOptionProps {
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ text, isSelected, isCorrect }) => {
  const textColor = isSelected 
    ? (isCorrect ? '#047857' : '#dc2626') 
    : 'black';
  
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
      <span>{text}</span>
    </div>
  );
};

export default AnswerOption;
