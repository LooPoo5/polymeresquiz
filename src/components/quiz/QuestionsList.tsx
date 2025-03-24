
import React from 'react';
import { Question as QuestionType } from '@/context/QuizContext';
import Question from '@/components/ui-components/Question';

type QuestionsListProps = {
  questions: QuestionType[];
  selectedAnswers: Record<string, string[]>;
  openEndedAnswers: Record<string, string>;
  handleAnswerSelect: (questionId: string, answerId: string, selected: boolean) => void;
  handleOpenEndedAnswerChange: (questionId: string, answer: string) => void;
};

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  selectedAnswers,
  openEndedAnswers,
  handleAnswerSelect,
  handleOpenEndedAnswerChange,
}) => {
  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Questions</h2>
      
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id}>
            <Question 
              question={question} 
              onChange={() => {}} 
              onDelete={() => {}} 
              isEditable={false} 
              selectedAnswers={selectedAnswers[question.id] || []} 
              onAnswerSelect={(answerId, selected) => 
                handleAnswerSelect(question.id, answerId, selected)
              } 
              openEndedAnswer={openEndedAnswers[question.id] || ''} 
              onOpenEndedAnswerChange={answer => 
                handleOpenEndedAnswerChange(question.id, answer)
              }
              questionNumber={index + 1}
              totalQuestions={questions.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsList;
