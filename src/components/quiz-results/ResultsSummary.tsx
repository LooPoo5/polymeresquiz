
import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import ScoreSummary from './ScoreSummary';
import { Participant } from '@/context/QuizContext';

interface ResultsSummaryProps {
  participant: Participant;
  scoreOn20: number;
  successRate: number;
  durationInSeconds: number;
  totalPoints: number;
  maxPoints: number;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  participant,
  scoreOn20,
  successRate,
  durationInSeconds,
  totalPoints,
  maxPoints
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:break-inside-avoid">
      <ParticipantInfo participant={participant} />
      
      <ScoreSummary
        scoreOn20={scoreOn20}
        successRate={successRate}
        durationInSeconds={durationInSeconds}
        totalPoints={totalPoints}
        maxPoints={maxPoints}
      />
    </div>
  );
};

export default ResultsSummary;
