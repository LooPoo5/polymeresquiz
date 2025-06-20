
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import sélectif de données</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedFile ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Sélectionnez un fichier JSON à importer
              </p>
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload size={16} className="mr-2" />
                Choisir un fichier
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Fichier sélectionné:</p>
                <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
              </div>

              {fileData && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Données à importer:</h4>
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
                          <Label htmlFor="import-quizzes">
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
                          <Label htmlFor="import-results">
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
                    <Label htmlFor="replace-existing" className="text-sm">
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

                  {isImporting && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Importation en cours...</span>
                        <span>{importProgress}%</span>
                      </div>
                      <Progress value={importProgress} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={resetDialog}
                      variant="outline"
                      disabled={isImporting}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleImport}
                      disabled={isImporting || (!importOptions.quizzes && !importOptions.results)}
                      className="flex-1"
                    >
                      {isImporting ? 'Importation...' : 'Importer'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectiveImportDialog;
