
import React from 'react';
import { Star, Trophy, Medal, Award } from 'lucide-react';
import { AchievementMetrics } from '@/utils/participantStats/types';
import MetricCard from './MetricCard';

interface AchievementCardProps {
  metrics: AchievementMetrics;
  quizCount: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ metrics, quizCount }) => {
  // Map mastery level to appropriate icon and colors
  const masteryIcon = {
    "Débutant": <Trophy size={20} className="text-blue-400" />,
    "Intermédiaire": <Medal size={20} className="text-amber-400" />,
    "Avancé": <Award size={20} className="text-amber-500" />,
    "Expert": <Star size={20} className="text-yellow-500" />
  };
  
  const masteryColor = {
    "Débutant": "text-blue-400",
    "Intermédiaire": "text-amber-400",
    "Avancé": "text-amber-500",
    "Expert": "text-yellow-500"
  };
  
  const masteryIconToShow = masteryIcon[metrics.masteryLevel as keyof typeof masteryIcon] || 
    masteryIcon["Débutant"];
  
  const masteryColorClass = masteryColor[metrics.masteryLevel as keyof typeof masteryColor] || 
    masteryColor["Débutant"];
  
  return (
    <MetricCard title="Réalisations" icon={Star}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Niveau de maîtrise</span>
          <div className={`flex items-center gap-1.5 font-medium ${masteryColorClass}`}>
            {masteryIconToShow}
            {metrics.masteryLevel}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Scores parfaits (20/20)</span>
          <div className="flex items-center gap-1 font-medium">
            <Star size={16} className="text-yellow-500" />
            {metrics.perfectScores} / {quizCount}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Scores excellents (≥16/20)</span>
          <div className="flex items-center gap-1 font-medium">
            <Award size={16} className="text-amber-500" />
            {metrics.excellentScores} / {quizCount}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Taux de réussite</span>
          <div className="font-medium">
            {metrics.passRate.toFixed(0)}%
          </div>
        </div>
      </div>
    </MetricCard>
  );
};

export default AchievementCard;
