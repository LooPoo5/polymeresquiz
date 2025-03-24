
import React from 'react';
import { Question } from '@/types/quiz';
import QuestionAnswers from './QuestionAnswers';
import QuestionOpenEnded from './QuestionOpenEnded';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswers?: string[];
  onAnswerSelect?: (answerId: string, selected: boolean) => void;
  openEndedAnswer?: string;
  onOpenEndedAnswerChange?: (answer: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswers = [],
  onAnswerSelect,
  openEndedAnswer = '',
  onOpenEndedAnswerChange
}) => {
  return (
    <div className="p-4">
      <div className="font-medium text-lg mb-2">{question.text}</div>
      
      {question.imageUrl && (
        <div className="mb-4 flex justify-center">
          <img 
            src={question.imageUrl} 
            alt="Question" 
            className="max-h-60 object-contain rounded-lg"
          />
        </div>
      )}
      
      <QuestionAnswers 
        question={question}
        selectedAnswers={selectedAnswers}
        onAnswerSelect={onAnswerSelect}
        isEditable={false}
      />
      
      {question.type === 'text' && (
        <QuestionOpenEnded
          question={question}
          openEndedAnswer={openEndedAnswer}
          onOpenEndedAnswerChange={onOpenEndedAnswerChange}
          isEditable={false}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
