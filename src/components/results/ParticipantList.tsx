
import React from 'react';
import { BarChart } from 'lucide-react';

interface ParticipantListProps {
  participants: string[];
  onViewParticipantStats: (participantName: string) => void;
}

const ParticipantList = ({ participants, onViewParticipantStats }: ParticipantListProps) => {
  if (participants.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Analyse par participant</h2>
      <div className="flex flex-wrap gap-2">
        {participants.map(participant => (
          <button
            key={participant}
            onClick={() => onViewParticipantStats(participant)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-red bg-opacity-10 text-brand-red hover:bg-opacity-20 transition-all"
          >
            <BarChart size={16} />
            <span>{participant}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
