
import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';

interface CelebrationProps {
  score: number;
  maxScore: number;
  threshold: number;
}

const Celebration = ({ score, maxScore, threshold = 75 }: CelebrationProps) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const successPercentage = Math.round((score / maxScore) * 100);
  
  useEffect(() => {
    if (successPercentage >= threshold) {
      setShowCelebration(true);
      
      // Stop celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [score, maxScore, threshold, successPercentage]);
  
  if (!showCelebration) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="confetti-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              backgroundColor: ['#ffcc00', '#ff6699', '#33cc33', '#3366ff', '#cc33ff'][
                Math.floor(Math.random() * 5)
              ],
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animation: `fall ${Math.random() * 3 + 2}s linear forwards, sway ${
                Math.random() * 3 + 2
              }s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-bounce text-center max-w-xs">
        <Award className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Félicitations !
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Excellent travail ! Vous avez obtenu un score remarquable.
        </p>
      </div>
    </div>
  );
};

export default Celebration;
