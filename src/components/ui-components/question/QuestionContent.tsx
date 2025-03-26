import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import QuestionTypeSelector from './QuestionTypeSelector';
import QuestionTitle from './QuestionTitle';
import QuestionImageSection from './QuestionImageSection';
import QuestionAnswersSection from './QuestionAnswersSection';
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
  onOpenEndedAnswerChange
}) => {
  return <div className="p-4 space-y-4 py-[5px]">
      <QuestionTitle question={question} onChange={onChange} isEditable={isEditable} titleInputRef={titleInputRef} />
      
      <QuestionImageSection question={question} onChange={onChange} isEditable={isEditable} />
      
      {isEditable && <QuestionTypeSelector question={question} onChange={onChange} />}
      
      <QuestionAnswersSection question={question} onChange={onChange} isEditable={isEditable} selectedAnswers={selectedAnswers} onAnswerSelect={onAnswerSelect} openEndedAnswer={openEndedAnswer} onOpenEndedAnswerChange={onOpenEndedAnswerChange} />
    </div>;
};
export default QuestionContent;