
import React, { useEffect, useRef } from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import QuestionTypeSelector from './question/QuestionTypeSelector';
import AnswersSection from './question/AnswersSection';
import OpenEndedAnswer from './question/OpenEndedAnswer';
import ImageUploader from './question/ImageUploader';
import PointsInput from './question/PointsInput';
import QuestionHeader from './question/QuestionHeader';
import QuestionTitle from './question/QuestionTitle';

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

  // Focus on title input when a new question is created (empty text)
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
          <div className="space-y-3">
            {/* Question type selector */}
            <QuestionTypeSelector 
              question={question} 
              onChange={onChange} 
            />
            
            {/* Points input */}
            <PointsInput 
              question={question} 
              onChange={onChange} 
            />
          </div>
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
    </div>
  );
};

export default QuestionWithImage;
