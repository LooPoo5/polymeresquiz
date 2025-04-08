
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
      <span>{text}</span>
    </div>
  );
};

export default AnswerOption;
