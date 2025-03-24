import React, { useEffect, useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import QuestionTypeSelector from './question/QuestionTypeSelector';
import AnswersSection from './question/AnswersSection';
import OpenEndedAnswer from './question/OpenEndedAnswer';
import ImageUploader from './question/ImageUploader';
import QuestionHeader from './question/QuestionHeader';
import QuestionTitle from './question/QuestionTitle';
import QuestionContent from './question/QuestionContent';

type QuestionProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  onDelete: () => void;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
  isEditable?: boolean;
};

const QuestionWithImage: React.FC<QuestionProps> = ({ 
  question, 
  onChange, 
  onDelete,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange,
  isEditable = true
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!question.text && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [question.text]);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <QuestionHeader 
        isEditable={isEditable} 
        onDelete={onDelete} 
      />
      
      <QuestionContent
        question={question}
        onChange={onChange}
        isEditable={isEditable}
        titleInputRef={titleInputRef}
        selectedAnswers={selectedAnswers}
        onAnswerSelect={onAnswerSelect}
        openEndedAnswer={openEndedAnswer}
        onOpenEndedAnswerChange={onOpenEndedAnswerChange}
      />
    </div>
  );
};

export default QuestionWithImage;
