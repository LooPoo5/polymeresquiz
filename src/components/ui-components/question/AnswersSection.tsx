
import React, { useRef, createRef, useEffect } from 'react';
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
  // Create refs for each answer input
  const answerRefs = useRef<React.RefObject<HTMLInputElement>[]>([]);
  
  // Update refs when answers change
  useEffect(() => {
    answerRefs.current = question.answers.map((_, i) => 
      answerRefs.current[i] || createRef<HTMLInputElement>()
    );
  }, [question.answers]);
  
  // Add a new answer and focus on its input
  const addNewAnswer = () => {
    const newAnswerIndex = (question.answers || []).length;
    handleAddAnswer(question, onChange);
    
    // Focus on the new answer input after render
    setTimeout(() => {
      if (answerRefs.current[newAnswerIndex] && answerRefs.current[newAnswerIndex].current) {
        answerRefs.current[newAnswerIndex].current?.focus();
      }
    }, 50);
  };
  
  // Handle key press in answer input
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNewAnswer();
    }
  };
  
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
          inputRef={answerRefs.current[index]}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
      
      {isEditable && (
        <button
          onClick={addNewAnswer}
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
