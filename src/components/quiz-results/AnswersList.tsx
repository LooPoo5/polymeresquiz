
import React from 'react';
import AnswerDetail from './AnswerDetail';
import { QuizResultAnswer } from './types';
import { calculateTotalPointsForQuestion } from './utils';

interface AnswersListProps {
  answers: QuizResultAnswer[];
  questions: Record<string, any>;
}

const AnswersList: React.FC<AnswersListProps> = ({ answers, questions }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Détail des réponses</h3>
      
      <div className="space-y-6">
        {answers.map((answer, index) => {
          const question = questions[answer.questionId];
          if (!question) return null;

          const totalQuestionPoints = calculateTotalPointsForQuestion(question);
          
          return (
            <AnswerDetail 
              key={answer.questionId}
              answer={answer}
              question={question}
              index={index}
              totalQuestionPoints={totalQuestionPoints}
              className="print:break-inside-avoid"
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnswersList;
