
import React from 'react';
import AnswerItem from './AnswerItem';
import { Question } from '@/context/types';
import { PdfAnswerItem } from './types';

interface AnswersListProps {
  answers: PdfAnswerItem[];
  questionsMap: Record<string, Question>;
}

const AnswersList: React.FC<AnswersListProps> = ({ answers, questionsMap }) => {
  return (
    <div style={{ 
      marginBottom: '8px',
      border: '1px solid #eaeaea',
      borderRadius: '4px',
      padding: '5px'
    }}>
      <h3 style={{ 
        fontWeight: '600',
        fontSize: '12px',
        paddingBottom: '3px',
        marginBottom: '5px',
        borderBottom: '1px solid #eaeaea',
        color: 'black'
      }}>
        Détail des réponses
      </h3>
      <div>
        {answers.map((answer, index) => {
          const question = questionsMap[answer.questionId];
          if (!question) return null;
          
          return (
            <AnswerItem 
              key={answer.questionId}
              question={question}
              answer={answer}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnswersList;
