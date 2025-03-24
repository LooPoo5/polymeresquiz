
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { Textarea } from '@/components/ui/textarea';

interface QuestionOpenEndedProps {
  question: QuestionType;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
  isEditable: boolean;
  onCorrectAnswerChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const QuestionOpenEnded: React.FC<QuestionOpenEndedProps> = ({
  question,
  openEndedAnswer = '',
  onOpenEndedAnswerChange,
  isEditable,
  onCorrectAnswerChange
}) => {
  if (question.type !== 'text') {
    return null;
  }

  const handleOpenEndedAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onOpenEndedAnswerChange) {
      onOpenEndedAnswerChange(e.target.value);
    }
  };

  if (isEditable) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Réponse correcte (référence pour la correction)
        </label>
        <Textarea
          value={question.correctAnswer || ''}
          onChange={onCorrectAnswerChange}
          placeholder="Réponse correcte attendue"
          className="w-full border border-gray-200 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          rows={3}
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Textarea
        value={openEndedAnswer}
        onChange={handleOpenEndedAnswerChange}
        placeholder="Votre réponse..."
        className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
        rows={4}
      />
    </div>
  );
};

export default QuestionOpenEnded;
