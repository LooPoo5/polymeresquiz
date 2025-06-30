
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface ImportData {
  quizzes?: any[];
  results?: any[];
}

interface ImportOptionsType {
  quizzes: boolean;
  results: boolean;
  replaceExisting: boolean;
}

interface ImportOptionsProps {
  fileData: ImportData;
  importOptions: ImportOptionsType;
  setImportOptions: React.Dispatch<React.SetStateAction<ImportOptionsType>>;
}

const ImportOptions: React.FC<ImportOptionsProps> = ({
  fileData,
  importOptions,
  setImportOptions
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3 text-gray-900">Données à importer:</h4>
        <div className="space-y-2">
          {fileData.quizzes && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="import-quizzes"
                checked={importOptions.quizzes}
                onCheckedChange={(checked) => 
                  setImportOptions(prev => ({ ...prev, quizzes: checked === true }))
                }
              />
              <Label htmlFor="import-quizzes" className="text-gray-700">
                Quiz ({fileData.quizzes.length})
              </Label>
            </div>
          )}
          
          {fileData.results && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="import-results"
                checked={importOptions.results}
                onCheckedChange={(checked) => 
                  setImportOptions(prev => ({ ...prev, results: checked === true }))
                }
              />
              <Label htmlFor="import-results" className="text-gray-700">
                Résultats ({fileData.results.length})
              </Label>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="replace-existing"
          checked={importOptions.replaceExisting}
          onCheckedChange={(checked) => 
            setImportOptions(prev => ({ ...prev, replaceExisting: checked === true }))
          }
        />
        <Label htmlFor="replace-existing" className="text-sm text-gray-700">
          Remplacer les données existantes
        </Label>
      </div>

      {!importOptions.replaceExisting && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <AlertCircle size={14} />
            <p className="text-sm font-medium">Mode ajout</p>
          </div>
          <p className="text-xs text-blue-600">
            Les nouvelles données seront ajoutées aux données existantes
          </p>
        </div>
      )}
    </div>
  );
};

export default ImportOptions;
