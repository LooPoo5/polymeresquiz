
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { 
  handleAnswerChange, 
  handleAnswerCorrectToggle, 
  handleDeleteAnswer 
} from './questionUtils';

type AnswerItemProps = {
  question: QuestionType;
  answer: {
    id: string;
    text: string;
    isCorrect: boolean;
    points: number;
  };
  index: number;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
  isSelected?: boolean;
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

const AnswerItem: React.FC<AnswerItemProps> = ({
  question,
  answer,
  index,
  onChange,
  isEditable,
  isSelected = false,
  onAnswerSelect,
  inputRef,
  onKeyDown
}) => {
  // Handle correct answer toggle
  const handleCorrectToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditable) {
      handleAnswerCorrectToggle(question, index, e.target.checked, onChange);
    } else if (onAnswerSelect) {
      onAnswerSelect(answer.id, e.target.checked);
    }
  };
  
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAnswerChange(question, index, 'text', e.target.value, onChange);
  };
  
  // Handle delete
  const handleDelete = () => {
    handleDeleteAnswer(question, index, onChange);
  };
  
  const inputType = question.type === 'multiple-choice' ? 'radio' : 'checkbox';
  
  return (
    <div className="flex items-center space-x-3 relative">
      <input
        type={inputType}
        id={`answer-${answer.id}`}
        name={`question-${question.id}`}
        checked={isEditable ? answer.isCorrect : isSelected}
        onChange={handleCorrectToggle}
        className="h-4 w-4 border-gray-300 text-brand-red focus:ring-brand-red"
      />
      
      {isEditable ? (
        <input
          type="text"
          value={answer.text}
          onChange={handleTextChange}
          onKeyDown={onKeyDown}
          placeholder="Saisir une réponse"
          className="flex-grow border-b border-gray-200 p-2 focus:outline-none focus:border-brand-red"
          ref={inputRef}
        />
      ) : (
        <label
          htmlFor={`answer-${answer.id}`}
          className="flex-grow text-gray-700 cursor-pointer"
        >
          {answer.text || 'Sans réponse'}
        </label>
      )}
      
      {isEditable && question.answers && question.answers.length > 1 && (
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 focus:outline-none"
          aria-label="Supprimer la réponse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default AnswerItem;
