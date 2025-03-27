
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface IndicatorCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ icon: Icon, title, children }) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
        <Icon className="text-brand-red" size={16} />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
};

export default IndicatorCard;
