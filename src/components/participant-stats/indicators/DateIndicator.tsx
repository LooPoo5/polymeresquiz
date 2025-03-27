
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import IndicatorCard from './IndicatorCard';

interface DateIndicatorProps {
  icon: LucideIcon;
  title: string;
  date: Date;
}

const DateIndicator: React.FC<DateIndicatorProps> = ({ icon, title, date }) => {
  return (
    <IndicatorCard icon={icon} title={title}>
      <div className="text-base font-medium">
        {format(date, 'PPP', { locale: fr })}
      </div>
    </IndicatorCard>
  );
};

export default DateIndicator;
