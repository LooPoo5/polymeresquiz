import React, { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { AlertCircle, Download, Upload, History, FileCheck, Loader2 } from 'lucide-react';
import { 
  exportSelectedData, 
  importData, 
  validateImportData, 
  getExportHistory, 
  getImportHistory 
} from '@/utils/dataExport';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/utils/timeUtils';

const DataPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState({
    quizzes: true,
    results: true,
  });
  const [exportHistory, setExportHistory] = useState<{ date: string; items: string[] }[]>([]);
  const [importHistory, setImportHistory] = useState<{ 
    date: string; 
    fileName: string;
    items: string[]; 
    counts: { quizCount: number; resultCount: number } 
  }[]>([]);
  const [validationStatus, setValidationStatus] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  }>({
    isValidating: false,
    isValid: null,
    message: '',
  });

  const { quizzes, results, refreshData } = useQuiz();

  useEffect(() => {
    setExportHistory(getExportHistory());
    setImportHistory(getImportHistory());
  }, []);

  const handleExport = async () => {
    if (!selectedItems.quizzes && !selectedItems.results) {
      toast.warning("Veuillez sélectionner au moins un type de données à exporter");
      return;
    }

    if ((selectedItems.quizzes && quizzes.length === 0) && 
        (selectedItems.results && results.length === 0)) {
      toast.warning("Il n'y a aucune donnée à exporter");
      return;
    }
    
    setIsExporting(true);
    setExportProgress(0);
    
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const selectedTypes = [];
      if (selectedItems.quizzes) selectedTypes.push('quizzes');
      if (selectedItems.results) selectedTypes.push('results');
      
      const success = await exportSelectedData(selectedTypes);
      
      if (success) {
        setExportProgress(100);
        setTimeout(() => {
          toast.success("Données exportées avec succès");
          setExportHistory(getExportHistory());
        }, 500);
      } else {
        toast.error("Erreur lors de l'exportation des données");
      }
    } catch (error) {
      toast.error("Erreur lors de l'exportation: " + 
        (error instanceof Error ? error.message : "Une erreur est survenue"));
    } finally {
      setTimeout(() => {
        clearInterval(progressInterval);
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleValidateFile = async (file: File) => {
    setValidationStatus({ isValidating: true, isValid: null, message: 'Validation en cours...' });
    
    try {
      const validationResult = await validateImportData(file);
      
      if (validationResult.isValid) {
        setValidationStatus({ 
          isValidating: false, 
          isValid: true, 
          message: `Fichier valide: ${validationResult.quizCount} quiz et ${validationResult.resultCount} résultats`
        });
        return validationResult;
      } else {
        setValidationStatus({ 
          isValidating: false, 
          isValid: false, 
          message: validationResult.message || 'Fichier invalide'
        });
        return null;
      }
    } catch (error) {
      setValidationStatus({ 
        isValidating: false, 
        isValid: false, 
        message: error instanceof Error ? error.message : 'Erreur de validation'
      });
      return null;
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      setImportProgress(10);
      
      const validationResult = await handleValidateFile(file);
      setImportProgress(30);
      
      if (!validationResult) {
        toast.error("Le fichier importé est invalide");
        setIsImporting(false);
        setImportProgress(0);
        e.target.value = '';
        return;
      }
      
      setImportProgress(50);
      
      if (quizzes.length > 0 || results.length > 0) {
        const confirmed = window.confirm(
          "L'importation remplacera toutes vos données existantes. Êtes-vous sûr de vouloir continuer?"
        );
        if (!confirmed) {
          setIsImporting(false);
          setImportProgress(0);
          e.target.value = '';
          setValidationStatus({ isValidating: false, isValid: null, message: '' });
          return;
        }
      }
      
      setImportProgress(70);
      
      const result = await importData(file, selectedItems);
      
      setImportProgress(100);
      
      setImportHistory(getImportHistory());
      
      toast.success(`Données importées avec succès: ${result.quizCount} quiz et ${result.resultCount} résultats`);
      
      refreshData();
      
    } catch (error) {
      toast.error("Erreur lors de l'importation: " + (error instanceof Error ? error.message : "Fichier invalide"));
    } finally {
      setTimeout(() => {
        setIsImporting(false);
        setImportProgress(0);
        e.target.value = '';
      }, 1000);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Gestion des Données</h1>
      
      <Tabs defaultValue="import-export">
        <TabsList className="mb-6">
          <TabsTrigger value="import-export">Importation & Exportation</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import-export">
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
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="quizzes" 
                    checked={selectedItems.quizzes}
                    onCheckedChange={(checked) => 
                      setSelectedItems({...selectedItems, quizzes: checked === true})
                    }
                  />
                  <label 
                    htmlFor="quizzes" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Quiz
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="results" 
                    checked={selectedItems.results}
                    onCheckedChange={(checked) => 
                      setSelectedItems({...selectedItems, results: checked === true})
                    }
                  />
                  <label 
                    htmlFor="results" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Résultats
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting} 
                    variant="outline" 
                    className="w-full flex flex-col items-center justify-center gap-4 py-12 font-normal text-xl bg-slate-50 hover:bg-slate-100 transition-all"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 size={32} className="animate-spin text-brand-red" />
                        <span>Exportation en cours...</span>
                        {exportProgress > 0 && (
                          <Progress value={exportProgress} className="w-full mt-2" />
                        )}
                      </>
                    ) : (
                      <>
                        <Download size={32} className="text-brand-red" />
                        <span className="font-normal">Exporter les données</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                  <Button 
                    onClick={handleImportClick} 
                    disabled={isImporting} 
                    variant="outline" 
                    className="w-full flex flex-col items-center justify-center gap-4 py-12 text-xl bg-slate-50 hover:bg-slate-100 transition-all"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 size={32} className="animate-spin text-brand-red" />
                        <span>Importation en cours...</span>
                        {importProgress > 0 && (
                          <Progress value={importProgress} className="w-full mt-2" />
                        )}
                      </>
                    ) : (
                      <>
                        <Upload size={32} className="text-brand-red" />
                        <span className="font-normal">Importer des données</span>
                      </>
                    )}
                  </Button>
                  
                  {validationStatus.message && (
                    <div className={`mt-4 p-3 rounded-md w-full text-sm ${
                      validationStatus.isValid === true 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : validationStatus.isValid === false
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {validationStatus.isValidating ? (
                        <div className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          {validationStatus.message}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {validationStatus.isValid === true ? (
                            <FileCheck size={14} />
                          ) : (
                            <AlertCircle size={14} />
                          )}
                          {validationStatus.message}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImport} 
                    className="hidden" 
                    accept=".json" 
                  />
                </div>
              </div>
              
              {(quizzes.length > 0 || results.length > 0) && (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3 text-brand-red">
                  <History size={20} />
                  <CardTitle>Historique des exportations</CardTitle>
                </div>
                <CardDescription>
                  Historique des dernières exportations de données
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {exportHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>Aucun historique d'exportation disponible</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {exportHistory.map((entry, index) => (
                      <div key={index} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">Exportation du {formatDate(new Date(entry.date))}</p>
                          <p className="text-sm text-gray-500">
                            Données: {entry.items.map(item => 
                              item === 'quizzes' ? 'Quiz' : 'Résultats'
                            ).join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3 text-brand-red">
                  <Upload size={20} />
                  <CardTitle>Historique des importations</CardTitle>
                </div>
                <CardDescription>
                  Historique des dernières importations de données
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {importHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Upload className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>Aucun historique d'importation disponible</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {importHistory.map((entry, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <p className="font-medium">Importation du {formatDate(new Date(entry.date))}</p>
                        <p className="text-sm text-gray-500 mt-1">Fichier: {entry.fileName}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {entry.items.includes('quizzes') && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Quiz: {entry.counts.quizCount}
                            </span>
                          )}
                          {entry.items.includes('results') && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Résultats: {entry.counts.resultCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataPage;
