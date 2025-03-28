
import React from 'react';
import { Award, Users, CopyCheck, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceSummaryProps {
  title: string;
  value: number;
  suffix?: string;
  total?: number;
  icon: 'Award' | 'Users' | 'CopyCheck' | 'TrendingUp' | 'FileText' | 'CheckCircle';
  color?: 'green' | 'orange' | 'red' | 'blue';
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  title,
  value,
  suffix = '',
  total,
  icon,
  color = 'blue'
}) => {
  // Map icon strings to components
  const IconMap = {
    Award: Award,
    Users: Users,
    CopyCheck: CopyCheck,
    TrendingUp: TrendingUp,
    FileText: FileText,
    CheckCircle: CheckCircle
  };
  
  const IconComponent = IconMap[icon];
  
  // Map colors to Tailwind classes
  const colorMap = {
    green: 'bg-green-50 text-green-600 border-green-100',
    orange: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  
  const iconColorMap = {
    green: 'text-green-500',
    orange: 'text-amber-500',
    red: 'text-red-500',
    blue: 'text-blue-500'
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-6 rounded-xl shadow-sm border ${colorMap[color]} flex items-center gap-4`}
    >
      <div className={`p-3 rounded-full bg-white ${iconColorMap[color]}`}>
        <IconComponent size={24} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {value}{suffix}
          </motion.span>
        </h3>
        <p className="text-sm opacity-80">{title}</p>
        {total !== undefined && (
          <p className="text-xs mt-1 opacity-60">
            {Math.round((value / total) * 100)}% du total
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PerformanceSummary;
