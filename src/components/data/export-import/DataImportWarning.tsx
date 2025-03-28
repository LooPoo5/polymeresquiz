
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DataImportWarningProps {
  showWarning: boolean;
}

const DataImportWarning = ({ showWarning }: DataImportWarningProps) => {
  if (!showWarning) return null;

  return (
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2 text-amber-700 mb-2">
        <AlertCircle size={16} className="bg-inherit" />
        <p className="font-medium">Attention</p>
      </div>
      <p className="text-amber-700 text-sm">
        L'importation remplace toutes vos données existantes. Assurez-vous d'avoir exporté 
        celles-ci si vous souhaitez les conserver.
      </p>
    </div>
  );
};

export default DataImportWarning;
