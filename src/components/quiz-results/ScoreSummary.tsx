
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  // Determine the score color based on performance
  const getScoreColor = (score: number) => {
    if (score >= 16) return "text-green-600";
    if (score >= 12) return "text-blue-600";
    if (score >= 10) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-brand-red to-rose-700">
              <Award className="w-8 h-8 text-white mb-1" />
              <div className={`text-5xl font-bold text-white mb-1 flex items-center`}>
                {scoreOn20.toFixed(1)}
                <span className="text-lg font-normal opacity-80 ml-1">/20</span>
              </div>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                Note finale
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
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
    </motion.div>
  );
};

export default ScoreSummary;
