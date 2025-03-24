
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';

type OpenEndedAnswerProps = {
  question: QuestionType;
  openEndedAnswer: string;
  onOpenEndedAnswerChange: (answer: string) => void;
};

const OpenEndedAnswer: React.FC<OpenEndedAnswerProps> = ({
  question,
  openEndedAnswer,
  onOpenEndedAnswerChange
}) => {
  return (
    <div>
      <label htmlFor={`question-${question.id}-answer`} className="block text-sm font-medium text-gray-700 mb-1">
        Votre réponse
      </label>
      <textarea
        id={`question-${question.id}-answer`}
        value={openEndedAnswer}
        onChange={(e) => onOpenEndedAnswerChange(e.target.value)}
        className="w-full h-24 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
        placeholder="Saisir votre réponse..."
      ></textarea>
    </div>
  );
};

export default OpenEndedAnswer;
