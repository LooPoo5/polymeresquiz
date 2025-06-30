
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ImportProgressProps {
  isImporting: boolean;
  importProgress: number;
}

const ImportProgress: React.FC<ImportProgressProps> = ({
  isImporting,
  importProgress
}) => {
  if (!isImporting) return null;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">Importation en cours...</span>
        <span className="text-gray-600">{importProgress}%</span>
      </div>
      <Progress value={importProgress} className="h-2" />
    </div>
  );
};

export default ImportProgress;
