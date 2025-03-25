
import React, { useEffect, useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import AnswerItem from './AnswerItem';
import { handleAddAnswer } from './questionUtils';

type AnswersSectionProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
};

const AnswersSection: React.FC<AnswersSectionProps> = ({
  question,
  onChange,
  isEditable,
  selectedAnswers = [],
  onAnswerSelect,
}) => {
  const latestAnswerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lorsque les réponses changent et que nous sommes en mode édition,
    // nous pouvons détecter s'il y a une nouvelle réponse
    if (isEditable && question.answers && question.answers.length > 0) {
      const inputs = latestAnswerRef.current?.querySelectorAll('input[type="text"]');
      const lastInput = inputs?.[inputs.length - 1] as HTMLInputElement;
      
      // Si la dernière réponse est vide, c'est probablement une nouvelle réponse
      if (lastInput && !lastInput.value) {
        lastInput.focus();
      }
    }
  }, [question.answers?.length, isEditable]);

  return (
    <div className="space-y-3">
      {isEditable && (
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Réponses
          </label>
          <span className="text-xs text-gray-500">
            {question.type === 'multiple-choice' 
              ? 'Sélectionnez une réponse correcte' 
              : 'Sélectionnez une ou plusieurs réponses correctes'}
          </span>
        </div>
      )}
      
      <div ref={latestAnswerRef}>
        {(question.answers || []).map((answer, index) => (
          <AnswerItem
            key={answer.id}
            question={question}
            answer={answer}
            index={index}
            onChange={onChange}
            isEditable={isEditable}
            isSelected={selectedAnswers.includes(answer.id)}
            onAnswerSelect={onAnswerSelect}
          />
        ))}
      </div>
      
      {isEditable && (
        <button
          onClick={() => handleAddAnswer(question, onChange)}
          className="text-sm text-brand-red hover:underline focus:outline-none flex items-center space-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Ajouter une réponse</span>
        </button>
      )}
    </div>
  );
};

export default AnswersSection;
