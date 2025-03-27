
import React, { useEffect, useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import QuestionHeader from './question/QuestionHeader';
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
  questionNumber?: number;
  totalQuestions?: number;
};

const Question: React.FC<QuestionProps> = ({ 
  question, 
  onChange, 
  onDelete,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange,
  isEditable = true,
  questionNumber,
  totalQuestions
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus on title input when a new question is created (empty text)
  useEffect(() => {
    if (!question.text && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [question.text]);
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      data-question-id={question.id}
    >
      <QuestionHeader 
        isEditable={isEditable} 
        onDelete={onDelete}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        question={question}
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

export default Question;
