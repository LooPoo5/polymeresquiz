
import React, { useRef, useState } from 'react';
import { toast } from "sonner";
import { Download, Upload, AlertCircle } from 'lucide-react';
import { exportAllData, exportSelectedData } from '@/utils/dataExport';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const DataExportImportPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [dataToExport, setDataToExport] = useState({
    quizzes: true,
    results: true,
  });
  const { quizzes, results } = useQuiz();

  // Simulate progress for visual feedback
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
  
  const handleExport = () => {
    if (
      (dataToExport.quizzes && quizzes.length === 0) && 
      (dataToExport.results && results.length === 0)
    ) {
      toast.warning("Il n'y a aucune donnée à exporter");
      return;
    }
    
    const success = dataToExport.quizzes && dataToExport.results 
      ? exportAllData() 
      : exportSelectedData(dataToExport.quizzes, dataToExport.results);
    
    if (success) {
      toast.success("Données exportées avec succès");
    } else {
      toast.error("Erreur lors de l'exportation des données");
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      const cleanup = simulateProgress();
      
      if (quizzes.length > 0 || results.length > 0) {
        const confirmed = window.confirm(
          "L'importation remplacera toutes vos données existantes. Êtes-vous sûr de vouloir continuer?"
        );
        if (!confirmed) {
          setIsImporting(false);
          e.target.value = '';
          cleanup();
          setImportProgress(0);
          return;
        }
      }
      
      // This will be handled by the existing importData function from utils
      const { importData } = await import('@/utils/dataExport');
      await importData(file);
      
      // Record import in history
      const historyItem = {
        id: Date.now().toString(),
        date: new Date(),
        filename: file.name,
        type: 'import',
      };
      
      const history = JSON.parse(localStorage.getItem('data-history') || '[]');
      history.push(historyItem);
      localStorage.setItem('data-history', JSON.stringify(history));
      
      setImportProgress(100);
      toast.success("Données importées avec succès. Rechargez la page pour voir les changements.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de l'importation: " + (error instanceof Error ? error.message : "Fichier invalide"));
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-4 text-brand-red">
        <AlertCircle size={20} />
        <h2 className="text-lg font-semibold">Importation et Exportation</h2>
      </div>
      
      <p className="mb-6 text-gray-600">
        Vous pouvez exporter vos données dans un fichier JSON que vous pourrez importer ultérieurement.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export section */}
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-md font-medium mb-4">Exporter les données</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-quizzes" 
                checked={dataToExport.quizzes}
                onCheckedChange={(checked) => 
                  setDataToExport(prev => ({ ...prev, quizzes: checked === true }))
                }
              />
              <Label htmlFor="export-quizzes">Quiz ({quizzes.length})</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-results" 
                checked={dataToExport.results}
                onCheckedChange={(checked) => 
                  setDataToExport(prev => ({ ...prev, results: checked === true }))
                }
              />
              <Label htmlFor="export-results">Résultats ({results.length})</Label>
            </div>
          </div>
          
          <Button 
            onClick={handleExport} 
            variant="outline"
            className="w-full mt-auto flex items-center justify-center gap-2 py-4 bg-red-50 hover:bg-red-100 text-brand-red border-red-200"
          >
            <Download size={16} />
            <span>Exporter</span>
          </Button>
        </div>
        
        {/* Import section */}
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-md font-medium mb-4">Importer des données</h3>
          
          <p className="text-sm text-gray-600 mb-6">
            Importez un fichier de données précédemment exporté au format JSON.
          </p>
          
          {isImporting && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Importation en cours...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
          )}
          
          <Button 
            onClick={handleImportClick} 
            variant="outline"
            disabled={isImporting}
            className="w-full mt-auto flex items-center justify-center gap-2 py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
          >
            <Upload size={16} />
            <span>{isImporting ? 'Importation...' : 'Importer'}</span>
          </Button>
          
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
            L'importation remplace toutes vos données existantes. Assurez-vous d'avoir exporté celles-ci si vous souhaitez les conserver.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default DataExportImportPanel;
