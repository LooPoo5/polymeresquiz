
import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  elapsedTime: number;
  timerRef: React.MutableRefObject<number | null>;
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
  hasStartedQuiz: boolean;
  startTime: Date | null;
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const QuizTimer: React.FC<QuizTimerProps> = ({ 
  elapsedTime, 
  timerRef, 
  setElapsedTime, 
  hasStartedQuiz, 
  startTime, 
  setStartTime 
}) => {
  useEffect(() => {
    if (hasStartedQuiz && !startTime) {
      const now = new Date();
      setStartTime(now);
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [hasStartedQuiz, startTime, setStartTime, setElapsedTime, timerRef]);

  return (
    <div className="flex items-center gap-1">
      <Clock size={16} />
      <span>{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default QuizTimer;
