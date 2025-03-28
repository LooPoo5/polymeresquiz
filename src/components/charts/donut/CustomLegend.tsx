
import React from 'react';

interface CustomLegendProps {
  payload?: any[];
}

const CustomLegend: React.FC<CustomLegendProps> = (props) => {
  const { payload } = props;
  
  // Add a safety check to handle when payload is undefined
  if (!payload || !Array.isArray(payload)) {
    return null; // Return null or a fallback UI when payload is undefined or not an array
  }
  
  return (
    <ul className="text-xs pl-0 space-y-1.5">
      {payload.map((entry: any, index: number) => (
        <li key={`legend-item-${index}`} className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-sm mr-2 inline-block" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.payload.shortName}</span>
          </div>
          <span className="font-medium ml-2">
            {entry.payload.count} quiz{entry.payload.count > 1 ? 's' : ''}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
