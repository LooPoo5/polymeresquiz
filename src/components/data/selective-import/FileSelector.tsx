
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileSelectorProps {
  selectedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  selectedFile,
  onFileSelect,
  fileInputRef
}) => {
  if (selectedFile) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">Fichier sélectionné:</p>
        <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Sélectionnez un fichier JSON à importer
      </p>
      
      <Button 
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        className="w-full bg-gray-50 hover:bg-gray-100 border-gray-300"
      >
        <Upload size={16} className="mr-2" />
        Choisir un fichier
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileSelector;
