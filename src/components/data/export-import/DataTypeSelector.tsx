
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
    <div className="mb-6 flex flex-wrap gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="quizzes" 
          checked={selectedItems.quizzes}
          onCheckedChange={(checked) => 
            setSelectedItems({...selectedItems, quizzes: checked === true})
          }
        />
        <label 
          htmlFor="quizzes" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Quiz
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="results" 
          checked={selectedItems.results}
          onCheckedChange={(checked) => 
            setSelectedItems({...selectedItems, results: checked === true})
          }
        />
        <label 
          htmlFor="results" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Résultats
        </label>
      </div>
    </div>
  );
};

export default DataTypeSelector;
