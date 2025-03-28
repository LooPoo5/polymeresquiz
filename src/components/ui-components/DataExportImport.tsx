
import React, { useState } from 'react';
import { DataTypeSelector, ExportButton, ImportButton } from './data-export-import';

const DataExportImport = () => {
  const [selectedItems, setSelectedItems] = useState({
    quizzes: true,
    results: true,
  });
  
  return (
    <div className="space-y-4">
      <DataTypeSelector 
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    
      <div className="flex flex-col sm:flex-row gap-2">
        <ExportButton selectedItems={selectedItems} />
        <ImportButton selectedItems={selectedItems} />
      </div>
    </div>
  );
};

export default DataExportImport;
