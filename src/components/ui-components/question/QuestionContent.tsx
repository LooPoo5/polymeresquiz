
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import QuestionTypeSelector from './QuestionTypeSelector';
import AnswersSection from './AnswersSection';
import OpenEndedAnswer from './OpenEndedAnswer';
import ImageUploader from './ImageUploader';
import QuestionTitle from './QuestionTitle';

type QuestionContentProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
  titleInputRef: React.RefObject<HTMLInputElement>;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
};

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  onChange,
  isEditable,
  titleInputRef,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange,
}) => {
  return (
    <div className="p-4 space-y-4">
      <QuestionTitle
        question={question}
        onChange={onChange}
        isEditable={isEditable}
        titleInputRef={titleInputRef}
      />
      
      {/* Image uploader */}
      <ImageUploader 
        question={question} 
        onChange={onChange} 
        isEditable={isEditable} 
      />
      
      {isEditable && (
        <QuestionTypeSelector 
          question={question} 
          onChange={onChange} 
        />
      )}
      
      {/* Multiple choice or checkbox questions */}
      {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
        <AnswersSection
          question={question}
          onChange={onChange}
          isEditable={isEditable}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={onAnswerSelect}
        />
      )}
      
      {/* Open ended answer for non-editable questions */}
      {question.type === 'open-ended' && !isEditable && onOpenEndedAnswerChange && (
        <OpenEndedAnswer
          question={question}
          openEndedAnswer={openEndedAnswer}
          onOpenEndedAnswerChange={onOpenEndedAnswerChange}
        />
      )}
    </div>
  );
};

export default QuestionContent;
