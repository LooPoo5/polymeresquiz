
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScoreGaugeChart from '@/components/charts/ScoreGaugeChart';

interface ScoreSummaryProps {
  scoreOn20: number;
  successRate: number;
  durationInSeconds: number;
  totalPoints: number;
  maxPoints: number;
}

const ScoreSummary = ({ 
  scoreOn20, 
  successRate, 
  durationInSeconds, 
  totalPoints, 
  maxPoints 
}: ScoreSummaryProps) => {
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Format score with 1 decimal place
  const formattedScore = scoreOn20.toFixed(1);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4"
    >
      {/* Score Gauge Chart */}
      <motion.div variants={itemVariants} className="flex justify-center mb-4">
        <ScoreGaugeChart 
          score={parseFloat(formattedScore)} 
          maxScore={20} 
          size="lg" 
          label="Note finale" 
        />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-indigo-700">
                <Trophy className="w-8 h-8 text-white mb-1" />
                <div className="text-5xl font-bold text-white mb-1">
                  {Math.floor(successRate)}
                  <span className="text-lg font-normal opacity-80">%</span>
                </div>
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                  Taux de réussite
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-500 to-amber-700">
                <Clock className="w-8 h-8 text-white mb-1" />
                <div className="text-4xl font-bold text-white mb-1">
                  {formatDuration(durationInSeconds)}
                </div>
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                  Temps total
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-green-700">
                <CheckCircle2 className="w-8 h-8 text-white mb-1" />
                <div className="text-4xl font-bold text-white mb-1">
                  {totalPoints}
                  <span className="text-lg font-normal opacity-80">/{maxPoints}</span>
                </div>
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                  Points obtenus
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Print-friendly summary table - only visible when printing */}
      <div className="hidden print:block mt-2 border rounded-lg p-3">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="py-1 flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                <span className="text-sm">Taux de réussite</span>
              </td>
              <td className="py-1 text-right font-bold">{Math.floor(successRate)}%</td>
            </tr>
            <tr className="border-b">
              <td className="py-1 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Temps total</span>
              </td>
              <td className="py-1 text-right font-bold">{formatDuration(durationInSeconds)}</td>
            </tr>
            <tr>
              <td className="py-1 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span className="text-sm">Points obtenus</span>
              </td>
              <td className="py-1 text-right font-bold">{totalPoints}/{maxPoints}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ScoreSummary;
