
import React, { useState } from 'react';
import { FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuiz } from '@/context/QuizContext';
import DataTypeSelector from './export-import/DataTypeSelector';
import ExportSection from './export/ExportSection';
import ImportSection from './import/ImportSection';
import DataImportWarning from './export-import/DataImportWarning';

const ExportImportTab = () => {
  const [selectedItems, setSelectedItems] = useState({
    quizzes: true,
    results: true,
  });

  const { quizzes, results } = useQuiz();

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-3 text-brand-red">
          <FileCheck size={20} />
          <CardTitle>Importation et Exportation</CardTitle>
        </div>
        <CardDescription>
          Vous pouvez exporter vos données dans un fichier JSON que vous pourrez importer ultérieurement.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <DataTypeSelector 
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExportSection selectedItems={selectedItems} />
          <ImportSection selectedItems={selectedItems} />
        </div>
        
        <DataImportWarning showWarning={quizzes.length > 0 || results.length > 0} />
      </CardContent>
    </Card>
  );
};

export default ExportImportTab;
