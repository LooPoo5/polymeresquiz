
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import AnswersSection from './AnswersSection';
import OpenEndedAnswer from './OpenEndedAnswer';

type QuestionAnswersSectionProps = {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
  isEditable: boolean;
  selectedAnswers: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
};

const QuestionAnswersSection: React.FC<QuestionAnswersSectionProps> = ({
  question,
  onChange,
  isEditable,
  selectedAnswers,
  onAnswerSelect,
  openEndedAnswer,
  onOpenEndedAnswerChange
}) => {
  // Show multiple choice or checkbox questions 
  if (question.type === 'multiple-choice' || question.type === 'checkbox') {
    return (
      <AnswersSection
        question={question}
        onChange={onChange}
        isEditable={isEditable}
        selectedAnswers={selectedAnswers}
        onAnswerSelect={onAnswerSelect}
      />
    );
  }
  
  // Show open ended answer input for non-editable questions
  if (question.type === 'open-ended' && !isEditable && onOpenEndedAnswerChange) {
    return (
      <OpenEndedAnswer
        question={question}
        openEndedAnswer={openEndedAnswer}
        onOpenEndedAnswerChange={onOpenEndedAnswerChange}
      />
    );
  }
  
  return null;
};

export default QuestionAnswersSection;
