
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  icon: Icon, 
  children 
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Icon size={18} className="text-brand-red" />
        {title}
      </h3>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default MetricCard;
