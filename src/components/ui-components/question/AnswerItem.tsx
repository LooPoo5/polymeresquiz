
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Question as QuestionType } from '@/context/QuizContext';
import { handleAnswerChange, handleAnswerCorrectToggle, handleDeleteAnswer } from './questionUtils';

type AnswerItemProps = {
  question: QuestionType;
  answer: {
    id: string;
    text: string;
    isCorrect: boolean;
    points?: number;
  };
  index: number;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
  isSelected?: boolean;
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
};

const AnswerItem: React.FC<AnswerItemProps> = ({
  question,
  answer,
  index,
  onChange,
  isEditable,
  isSelected = false,
  onAnswerSelect,
}) => {
  return (
    <div key={answer.id} className="space-y-2">
      <div className="flex items-start space-x-3">
        <div className="pt-2">
          <input
            type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'}
            name={`question-${question.id}-answer-correct`}
            checked={isEditable ? answer.isCorrect : isSelected}
            onChange={(e) => {
              if (isEditable) {
                handleAnswerCorrectToggle(question, index, e.target.checked, onChange);
              } else if (onAnswerSelect) {
                onAnswerSelect(answer.id, e.target.checked);
              }
            }}
            className="h-4 w-4 accent-brand-red"
            disabled={!isEditable && !onAnswerSelect}
          />
        </div>
        
        <div className="flex-grow">
          {isEditable ? (
            <input
              type="text"
              placeholder={`Réponse ${index + 1}`}
              value={answer.text}
              onChange={(e) => handleAnswerChange(question, index, 'text', e.target.value, onChange)}
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
          ) : (
            <div className="py-2">{answer.text}</div>
          )}
        </div>
        
        {isEditable && (
          <div className="pt-1">
            <button
              onClick={() => handleDeleteAnswer(question, index, onChange)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete answer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isEditable && answer.isCorrect && (
        <div className="flex items-center pl-7 space-x-2">
          <label className="text-sm text-gray-600">Points:</label>
          <input
            type="number"
            min="1"
            value={answer.points || 1}
            onChange={(e) => handleAnswerChange(
              question, 
              index, 
              'points', 
              parseInt(e.target.value) || 1, 
              onChange
            )}
            className="w-16 border border-gray-200 rounded p-1 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
};

export default AnswerItem;
