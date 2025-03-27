import React from 'react';
import { User, ClipboardList, Award, Clock } from 'lucide-react';
import { ParticipantStats } from '@/utils/participantStats';
import { formatDuration } from '@/utils/participantStats';
interface ParticipantHeaderProps {
  stats: ParticipantStats;
}
const ParticipantHeader: React.FC<ParticipantHeaderProps> = ({
  stats
}) => {
  return <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User size={24} className="text-brand-red" />
          {stats.name}
        </h1>
        
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500">Quiz réalisés</div>
          <div className="text-xl font-bold text-brand-red flex items-center gap-1">
            <ClipboardList size={16} className="opacity-70" />
            {stats.quizCount}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500">Moyenne</div>
          <div className="text-xl font-bold text-brand-red flex items-center gap-1">
            <Award size={16} className="opacity-70" />
            {stats.averageScoreOn20.toFixed(1)}/20
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500">Temps moyen</div>
          <div className="text-xl font-bold text-brand-red flex items-center gap-1">
            <Clock size={16} className="opacity-70" />
            {formatDuration(Math.round(stats.averageDurationInSeconds))}
          </div>
        </div>
      </div>
    </div>;
};
export default ParticipantHeader;