
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImportOptionsType {
  quizzes: boolean;
  results: boolean;
  replaceExisting: boolean;
}

interface ImportActionsProps {
  isImporting: boolean;
  importOptions: ImportOptionsType;
  onCancel: () => void;
  onImport: () => void;
}

const ImportActions: React.FC<ImportActionsProps> = ({
  isImporting,
  importOptions,
  onCancel,
  onImport
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onCancel}
        variant="outline"
        disabled={isImporting}
        className="flex-1 bg-gray-50 hover:bg-gray-100 border-gray-300"
      >
        Annuler
      </Button>
      <Button 
        onClick={onImport}
        disabled={isImporting || (!importOptions.quizzes && !importOptions.results)}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isImporting ? 'Importation...' : 'Importer'}
      </Button>
    </div>
  );
};

export default ImportActions;
