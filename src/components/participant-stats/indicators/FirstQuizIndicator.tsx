
import React from 'react';
import { Calendar } from 'lucide-react';
import DateIndicator from './DateIndicator';

interface FirstQuizIndicatorProps {
  date: Date;
}

const FirstQuizIndicator: React.FC<FirstQuizIndicatorProps> = ({ date }) => {
  return (
    <DateIndicator
      icon={Calendar}
      title="Premier quiz"
      date={date}
    />
  );
};

export default FirstQuizIndicator;
