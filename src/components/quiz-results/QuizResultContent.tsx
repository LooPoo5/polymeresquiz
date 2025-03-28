
import React from 'react';
import ResultsSummary from './ResultsSummary';
import ScoreVisualizations from './ScoreVisualizations';
import AnswersList from './AnswersList';
import { Participant } from '@/context/QuizContext';
import { QuizResultAnswer } from './types';

interface QuizResultContentProps {
  quizTitle: string;
  participant: Participant;
  scoreOn20: number;
  successRate: number;
  durationInSeconds: number;
  totalPoints: number;
  maxPoints: number;
  correctAnswers: number;
  incorrectAnswers: number;
  formattedAnswers: QuizResultAnswer[];
  questionsMap: Record<string, any>;
}

const QuizResultContent: React.FC<QuizResultContentProps> = ({
  participant,
  scoreOn20,
  successRate,
  durationInSeconds,
  totalPoints,
  maxPoints,
  correctAnswers,
  incorrectAnswers,
  formattedAnswers,
  questionsMap
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 print:shadow-none print:border-none dark:bg-gray-900 dark:border-gray-800">
      <ResultsSummary
        participant={participant}
        scoreOn20={scoreOn20}
        successRate={successRate}
        durationInSeconds={durationInSeconds}
        totalPoints={totalPoints}
        maxPoints={maxPoints}
      />
      
      <ScoreVisualizations 
        correctQuestions={correctAnswers}
        incorrectQuestions={incorrectAnswers}
        totalPoints={totalPoints}
        maxPoints={maxPoints}
        successRate={successRate}
        className="print:break-inside-avoid mb-8"
      />
      
      <AnswersList answers={formattedAnswers} questions={questionsMap} />
    </div>
  );
};

export default QuizResultContent;
