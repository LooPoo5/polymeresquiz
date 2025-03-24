
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';

interface QuestionAnswersProps {
  question: QuestionType;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  isEditable: boolean;
}

const QuestionAnswers: React.FC<QuestionAnswersProps> = ({
  question,
  selectedAnswers = [],
  onAnswerSelect,
  isEditable
}) => {
  if (isEditable) return null;

  const handleMultipleChoiceSelect = (answerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAnswerSelect) {
      onAnswerSelect(answerId, e.target.checked);
    }
  };

  if (question.type === 'text') {
    return null;
  }

  if (question.type === 'multiple-choice' || question.type === 'satisfaction') {
    return (
      <div className="space-y-2 mt-4">
        {question.answers.map(answer => (
          <div key={answer.id} className="flex items-center">
            <input
              type="radio"
              id={`answer-${answer.id}`}
              name={`question-${question.id}`}
              checked={selectedAnswers.includes(answer.id)}
              onChange={(e) => handleMultipleChoiceSelect(answer.id, e)}
              className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
            />
            <label htmlFor={`answer-${answer.id}`} className="ml-2 block text-sm">
              {answer.text}
            </label>
          </div>
        ))}
      </div>
    );
  }

  if (question.type === 'checkbox') {
    return (
      <div className="space-y-2 mt-4">
        {question.answers.map(answer => (
          <div key={answer.id} className="flex items-center">
            <input
              type="checkbox"
              id={`answer-${answer.id}`}
              checked={selectedAnswers.includes(answer.id)}
              onChange={(e) => handleMultipleChoiceSelect(answer.id, e)}
              className="h-4 w-4 text-brand-red focus:ring-brand-red rounded border-gray-300"
            />
            <label htmlFor={`answer-${answer.id}`} className="ml-2 block text-sm">
              {answer.text}
            </label>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default QuestionAnswers;
