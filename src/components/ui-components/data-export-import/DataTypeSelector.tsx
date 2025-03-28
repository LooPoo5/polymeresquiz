
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface DataTypeSelectorProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
  setSelectedItems: React.Dispatch<React.SetStateAction<{
    quizzes: boolean;
    results: boolean;
  }>>;
}

const DataTypeSelector = ({ selectedItems, setSelectedItems }: DataTypeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="export-quizzes" 
          checked={selectedItems.quizzes}
          onCheckedChange={(checked) => 
            setSelectedItems({...selectedItems, quizzes: checked === true})
          }
        />
        <label 
          htmlFor="export-quizzes" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Quiz
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="export-results" 
          checked={selectedItems.results}
          onCheckedChange={(checked) => 
            setSelectedItems({...selectedItems, results: checked === true})
          }
        />
        <label 
          htmlFor="export-results" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Résultats
        </label>
      </div>
    </div>
  );
};

export default DataTypeSelector;
