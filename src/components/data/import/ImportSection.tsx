
import React, { useRef } from 'react';
import FileUploadButton from './FileUploadButton';
import DataValidationStatus from '../DataValidationStatus';
import { useFileImport } from './useFileImport';

interface ImportSectionProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
}

const ImportSection = ({ selectedItems }: ImportSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, handleImport } = useFileImport(selectedItems);
  const { isImporting, importProgress, validationStatus } = status;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImport(file);
      e.target.value = ''; // Reset input after handling
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
      <FileUploadButton 
        isImporting={isImporting} 
        importProgress={importProgress}
        onClick={handleUploadClick} 
      />
      
      <DataValidationStatus status={validationStatus} />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".json" 
      />
    </div>
  );
};

export default ImportSection;
