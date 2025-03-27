
import React from 'react';
import { Calendar } from 'lucide-react';
import DateIndicator from './DateIndicator';

interface LastQuizIndicatorProps {
  date: Date;
}

const LastQuizIndicator: React.FC<LastQuizIndicatorProps> = ({ date }) => {
  return (
    <DateIndicator
      icon={Calendar}
      title="Dernier quiz"
      date={date}
    />
  );
};

export default LastQuizIndicator;
