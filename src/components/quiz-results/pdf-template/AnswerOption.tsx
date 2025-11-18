
import React from 'react';
import { AnswerOptionProps } from './types';

const AnswerOption: React.FC<AnswerOptionProps> = ({ text, isSelected, isCorrect, points }) => {
  // Déterminer la couleur du texte selon la sélection et la correction
  let textColor = 'black';
  
  if (isSelected && isCorrect) {
    textColor = '#047857'; // vert : sélectionné et correct
  } else if (isSelected && !isCorrect) {
    textColor = '#dc2626'; // rouge : sélectionné et incorrect
  } else if (!isSelected && isCorrect) {
    textColor = '#F97316'; // orange : correct mais non sélectionné
  }
  
  // Affichage des points pour les bonnes réponses
  const pointsText = isCorrect && points ? ` (${points} pt${points > 1 ? 's' : ''})` : '';
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '3px',
        fontSize: '11px',
        pageBreakInside: 'avoid',
        color: textColor,
        lineHeight: '1.4',
      }}
    >
      {/* Puce alignée verticalement et horizontalement */}
      <span
        style={{
          display: 'inline-block',
          width: '14px',
          minWidth: '14px',
          marginRight: '6px',
          textAlign: 'center',
        }}
      >
        {isSelected ? '•' : '○'}
      </span>

      {/* Texte sur plusieurs lignes, bien lisible */}
      <span style={{ flex: 1 }}>
        {text}
        {pointsText}
      </span>
    </div>
  );
};

export default AnswerOption;
