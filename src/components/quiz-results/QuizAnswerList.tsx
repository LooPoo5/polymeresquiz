
import React from 'react';
import { Question } from '@/context/QuizContext';
import AnswerDetail from '@/components/quiz-results/AnswerDetail';
import { calculateTotalPointsForQuestion } from '@/components/quiz-results/utils';
import { QuizResultAnswer } from '@/components/quiz-results/types';

interface QuizAnswerListProps {
  answers: any[];
  questionsMap: Record<string, Question>;
}

const QuizAnswerList: React.FC<QuizAnswerListProps> = ({ answers, questionsMap }) => {
  // Convert the answers format to match what AnswerDetail expects
  const formattedAnswers: QuizResultAnswer[] = answers.map(answer => {
    // Create the givenAnswers array based on the available data
    let givenAnswers: string[] = [];
    
    if (answer.answerText) {
      // For open-ended questions
      givenAnswers = [answer.answerText];
    } else if (answer.answerIds && answer.answerIds.length > 0) {
      // For checkbox questions
      givenAnswers = answer.answerIds;
    } else if (answer.answerId) {
      // For multiple-choice questions
      givenAnswers = [answer.answerId];
    }
    
    return {
      ...answer,
      givenAnswers
    };
  });

  return (
    <div className="space-y-6">
      {formattedAnswers.map((answer, index) => {
        const question = questionsMap[answer.questionId];
        if (!question) return null;

        // Calculate the total possible points for this question
        const totalQuestionPoints = calculateTotalPointsForQuestion(question);
        
        return (
          <AnswerDetail 
            key={answer.questionId}
            answer={answer}
            question={question}
            index={index}
            totalQuestionPoints={totalQuestionPoints}
          />
        );
      })}
    </div>
  );
};

export default QuizAnswerList;
