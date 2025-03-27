
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { ArrowLeft } from 'lucide-react';
import { 
  getParticipantStats, 
  ParticipantStats as ParticipantStatsType
} from '@/utils/participantStats';
import ParticipantHeader from '@/components/participant-stats/ParticipantHeader';
import StatsTrendCharts from '@/components/participant-stats/StatsTrendCharts';
import ComparisonStats from '@/components/participant-stats/ComparisonStats';
import QuizHistoryTable from '@/components/participant-stats/QuizHistoryTable';
import StatsLoadingState from '@/components/participant-stats/StatsLoadingState';
import AdvancedMetrics from '@/components/participant-stats/AdvancedMetrics';

const ParticipantStats = () => {
  const { participantName } = useParams<{ participantName: string }>();
  const { results } = useQuiz();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ParticipantStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!participantName) {
      navigate('/results');
      return;
    }

    const decodedName = decodeURIComponent(participantName);
    const participantStats = getParticipantStats(decodedName, results);
    
    if (!participantStats) {
      navigate('/results');
      return;
    }
    
    setStats(participantStats);
    setLoading(false);
  }, [participantName, results, navigate]);

  if (loading || !stats) {
    return <StatsLoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button 
        onClick={() => navigate('/results')} 
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Retour aux résultats</span>
      </button>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <ParticipantHeader stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <StatsTrendCharts stats={stats} />
          <ComparisonStats stats={stats} />
        </div>
      </div>
      
      {/* New Advanced Metrics Section */}
      <AdvancedMetrics stats={stats} />
      
      <QuizHistoryTable quizzes={stats.quizzes} navigate={navigate} />
    </div>
  );
};

export default ParticipantStats;
