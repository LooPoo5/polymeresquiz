
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import { handleQuestionChange } from './questionUtils';

type QuestionTitleProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
  titleInputRef: React.RefObject<HTMLInputElement>;
};

const QuestionTitle: React.FC<QuestionTitleProps> = ({
  question,
  onChange,
  isEditable,
  titleInputRef
}) => {
  return (
    <div>
      {isEditable ? (
        <input
          id={`question-${question.id}-text`}
          name="text"
          type="text"
          value={question.text}
          onChange={(e) => handleQuestionChange(question, e.target.name, e.target.value, onChange)}
          ref={titleInputRef}
          placeholder="Entrez le texte de la question"
          className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          required
        />
      ) : (
        <div className="font-bold text-lg mb-4">{question.text}</div>
      )}
    </div>
  );
};

export default QuestionTitle;
