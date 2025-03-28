
import React from 'react';
import ExportButton from './ExportButton';
import { useExport } from './useExport';

interface ExportSectionProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
}

const ExportSection = ({ selectedItems }: ExportSectionProps) => {
  const { isExporting, exportProgress, handleExport } = useExport({ selectedItems });

  return (
    <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
      <ExportButton
        isExporting={isExporting}
        exportProgress={exportProgress}
        onClick={handleExport}
      />
    </div>
  );
};

export default ExportSection;
