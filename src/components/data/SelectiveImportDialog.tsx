
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import FileSelector from './selective-import/FileSelector';
import ImportOptions from './selective-import/ImportOptions';
import ImportProgress from './selective-import/ImportProgress';
import ImportActions from './selective-import/ImportActions';

interface ImportData {
  quizzes?: any[];
  results?: any[];
}

interface SelectiveImportDialogProps {
  onImportComplete: () => void;
}

const SelectiveImportDialog: React.FC<SelectiveImportDialogProps> = ({ onImportComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<ImportData | null>(null);
  const [importOptions, setImportOptions] = useState({
    quizzes: true,
    results: true,
    replaceExisting: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateProgress = () => {
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
    return () => clearInterval(interval);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Format de fichier invalide');
        }

        const data = JSON.parse(result);
        setFileData(data);
        setSelectedFile(file);
        
        // Auto-detect what data is available
        setImportOptions(prev => ({
          ...prev,
          quizzes: !!data.quizzes?.length,
          results: !!data.results?.length
        }));
      } catch (error) {
        toast.error('Erreur lors de la lecture du fichier: ' + (error instanceof Error ? error.message : 'Fichier invalide'));
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!fileData || !selectedFile) return;

    try {
      setIsImporting(true);
      const cleanup = simulateProgress();

      // Get existing data if we're not replacing
      let existingQuizzes: any[] = [];
      let existingResults: any[] = [];

      if (!importOptions.replaceExisting) {
        const storedQuizzes = localStorage.getItem('quizzes');
        const storedResults = localStorage.getItem('quiz-results');
        
        if (storedQuizzes) {
          existingQuizzes = JSON.parse(storedQuizzes);
        }
        if (storedResults) {
          existingResults = JSON.parse(storedResults);
        }
      }

      // Process quizzes
      if (importOptions.quizzes && fileData.quizzes) {
        const quizzesWithDates = fileData.quizzes.map((quiz: any) => ({
          ...quiz,
          createdAt: new Date(quiz.createdAt)
        }));

        const finalQuizzes = importOptions.replaceExisting 
          ? quizzesWithDates 
          : [...existingQuizzes, ...quizzesWithDates];

        localStorage.setItem('quizzes', JSON.stringify(finalQuizzes));
      }

      // Process results
      if (importOptions.results && fileData.results) {
        const resultsWithDates = fileData.results.map((result: any) => ({
          ...result,
          startTime: new Date(result.startTime),
          endTime: new Date(result.endTime)
        }));

        const finalResults = importOptions.replaceExisting 
          ? resultsWithDates 
          : [...existingResults, ...resultsWithDates];

        localStorage.setItem('quiz-results', JSON.stringify(finalResults));
      }

      // Record in history
      const historyItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        filename: selectedFile.name,
        type: 'import' as const
      };
      const history = JSON.parse(localStorage.getItem('data-history') || '[]');
      history.push(historyItem);
      localStorage.setItem('data-history', JSON.stringify(history));

      setImportProgress(100);
      toast.success("Données importées avec succès. Rechargez la page pour voir les changements.");
      
      setTimeout(() => {
        setIsOpen(false);
        onImportComplete();
        window.location.reload();
      }, 2000);

    } catch (error) {
      toast.error("Erreur lors de l'importation: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    } finally {
      setIsImporting(false);
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setFileData(null);
    setImportProgress(0);
    setImportOptions({
      quizzes: true,
      results: true,
      replaceExisting: false
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
        >
          <Upload size={16} />
          <span>Import sélectif</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Import sélectif de données</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <FileSelector 
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            fileInputRef={fileInputRef}
          />
          
          {selectedFile && fileData && (
            <div className="space-y-4">
              <ImportOptions 
                fileData={fileData}
                importOptions={importOptions}
                setImportOptions={setImportOptions}
              />
              
              <ImportProgress 
                isImporting={isImporting}
                importProgress={importProgress}
              />
              
              <ImportActions 
                isImporting={isImporting}
                importOptions={importOptions}
                onCancel={resetDialog}
                onImport={handleImport}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectiveImportDialog;
