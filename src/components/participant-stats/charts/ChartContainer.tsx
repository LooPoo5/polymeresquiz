
import React from 'react';
import { Users } from 'lucide-react';

interface ChartContainerProps {
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Users size={18} className="text-brand-red" />
        Comparaison avec les autres participants
      </h3>
      {children}
    </div>
  );
};

export default ChartContainer;
