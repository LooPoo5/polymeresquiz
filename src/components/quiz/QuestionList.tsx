
import React from 'react';
import Question from '@/components/ui-components/Question';
import { SelectedAnswers, OpenEndedAnswers } from '@/hooks/useQuizSubmission';

interface QuestionListProps {
  questions: any[];
  selectedAnswers: SelectedAnswers;
  openEndedAnswers: OpenEndedAnswers;
  onAnswerSelect: (questionId: string, answerId: string, selected: boolean) => void;
  onOpenEndedAnswerChange: (questionId: string, answer: string) => void;
}

const QuestionList = ({
  questions,
  selectedAnswers,
  openEndedAnswers,
  onAnswerSelect,
  onOpenEndedAnswerChange
}: QuestionListProps) => {
  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Questions</h2>
      
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id}>
            <div className="text-sm text-gray-500 mb-1">Question {index + 1}/{questions.length}</div>
            <Question 
              question={question} 
              onChange={() => {}} 
              onDelete={() => {}} 
              selectedAnswers={selectedAnswers[question.id] || []} 
              onAnswerSelect={(answerId, selected) => onAnswerSelect(question.id, answerId, selected)} 
              openEndedAnswer={openEndedAnswers[question.id] || ''} 
              onOpenEndedAnswerChange={answer => onOpenEndedAnswerChange(question.id, answer)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
