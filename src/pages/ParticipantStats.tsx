
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { ArrowLeft, User, Calendar, Clock, Award, Zap, ChevronRight, ClipboardList, BarChart, TrendingUp, Users, FileText } from 'lucide-react';
import { 
  getParticipantStats, 
  ParticipantStats as ParticipantStatsType,
  formatDuration 
} from '@/utils/participantStats';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

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
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md mb-6 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Chart configurations
  const chartConfig = {
    score: {
      label: "Score sur 20",
      theme: {
        light: "#d946ef", // Magenta
        dark: "#d946ef",
      },
    },
    time: {
      label: "Temps (minutes)",
      theme: {
        light: "#0ea5e9", // Ocean blue
        dark: "#0ea5e9",
      },
    },
    comparison: {
      label: "Comparaison",
      theme: {
        light: "#8b5cf6", // Vivid purple
        dark: "#8b5cf6",
      },
    },
    participant: {
      label: "Participant",
      theme: {
        light: "#f97316", // Bright orange
        dark: "#f97316",
      },
    },
    average: {
      label: "Moyenne Globale",
      theme: {
        light: "#6e59a5", // Tertiary purple
        dark: "#6e59a5",
      },
    },
  };

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
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User size={24} className="text-brand-red" />
              {stats.name}
            </h1>
            <p className="text-gray-600">Formateur: {stats.instructor}</p>
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
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Score Trends Chart */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-red" />
              Évolution des scores
            </h3>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <LineChart data={stats.scoreData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[0, 20]} className="text-xs" />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent>
                            <div className="text-sm font-medium">{payload[0].payload.date}</div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[var(--color-score)]" />
                              <span>Score: {payload[0].value}/20</span>
                            </div>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="score"
                    strokeWidth={2}
                    stroke="var(--color-score)"
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
          
          {/* Quiz Time Chart */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock size={18} className="text-brand-red" />
              Temps de réalisation (minutes)
            </h3>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <LineChart data={stats.durationData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent>
                            <div className="text-sm font-medium">{payload[0].payload.date}</div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[var(--color-time)]" />
                              <span>Temps: {payload[0].value} min</span>
                            </div>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    name="time"
                    strokeWidth={2}
                    stroke="var(--color-time)"
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
          
          {/* Comparison Bar Chart */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users size={18} className="text-brand-red" />
              Comparaison avec les autres participants
            </h3>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <RechartsBarChart
                  data={[
                    {
                      metric: "Score moyen",
                      participant: stats.averageScoreOn20.toFixed(1),
                      average: stats.comparisonStats.globalAverageScore.toFixed(1),
                    },
                    {
                      metric: "Temps moyen (min)",
                      participant: (stats.averageDurationInSeconds / 60).toFixed(1),
                      average: (stats.comparisonStats.globalAverageDuration / 60).toFixed(1),
                    }
                  ]}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis type="category" dataKey="metric" width={80} className="text-xs" />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent>
                            <div className="text-sm font-medium">{payload[0].payload.metric}</div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[var(--color-participant)]" />
                                <span>{stats.name}: {payload[0].value}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[var(--color-average)]" />
                                <span>Moyenne: {payload[1].value}</span>
                              </div>
                            </div>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="participant" name="participant" fill="var(--color-participant)" />
                  <Bar dataKey="average" name="average" fill="var(--color-average)" />
                </RechartsBarChart>
              </ChartContainer>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BarChart size={18} className="text-brand-red" />
              Indicateurs de performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Score Percentile */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Award className="text-brand-red" size={16} />
                  <span>Score</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stats.comparisonStats.scorePercentile}%</span>
                  <span className="text-sm text-gray-500 mb-1">des participants</span>
                </div>
                <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-red h-full rounded-full"
                    style={{ width: `${stats.comparisonStats.scorePercentile}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.name} a un meilleur score que {stats.comparisonStats.scorePercentile}% des participants.
                </p>
              </div>
              
              {/* Speed Percentile */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Zap className="text-brand-red" size={16} />
                  <span>Rapidité</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stats.comparisonStats.speedPercentile}%</span>
                  <span className="text-sm text-gray-500 mb-1">des participants</span>
                </div>
                <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-red h-full rounded-full"
                    style={{ width: `${stats.comparisonStats.speedPercentile}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.name} est plus rapide que {stats.comparisonStats.speedPercentile}% des participants.
                </p>
              </div>
              
              {/* First & Last Quiz */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="text-brand-red" size={16} />
                  <span>Premier quiz</span>
                </div>
                <div className="text-base font-medium">
                  {format(stats.firstQuizDate, 'PPP', { locale: fr })}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="text-brand-red" size={16} />
                  <span>Dernier quiz</span>
                </div>
                <div className="text-base font-medium">
                  {format(stats.lastQuizDate, 'PPP', { locale: fr })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quiz History Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-brand-red" />
          Historique des quiz
        </h2>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Temps</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{format(quiz.date, 'dd/MM/yyyy')}</span>
                    <span className="text-xs text-gray-500">{quiz.timeAgo}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>
                  <span className={quiz.scoreOn20 >= 10 ? 'text-green-600' : 'text-red-600'}>
                    {quiz.scoreOn20}/20
                  </span>
                </TableCell>
                <TableCell>{formatDuration(quiz.durationInSeconds)}</TableCell>
                <TableCell>
                  <button 
                    onClick={() => navigate(`/quiz-results/${quiz.id}`)}
                    className="inline-flex items-center text-brand-red hover:underline text-sm"
                  >
                    Détails <ChevronRight size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ParticipantStats;
