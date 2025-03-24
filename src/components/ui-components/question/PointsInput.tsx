
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { handlePointsChange } from './questionUtils';

type PointsInputProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
};

const PointsInput: React.FC<PointsInputProps> = ({
  question,
  onChange
}) => {
  return (
    <div>
      <label htmlFor={`question-${question.id}-points`} className="block text-sm font-medium text-gray-700 mb-1">
        Points (valeur par défaut)
      </label>
      <input
        id={`question-${question.id}-points`}
        name="points"
        type="number"
        min="1"
        value={question.points || 1}
        onChange={(e) => handlePointsChange(question, parseInt(e.target.value) || 1, onChange)}
        className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
      />
    </div>
  );
};

export default PointsInput;
