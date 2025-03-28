
import React, { useRef, useState } from 'react';
import { toast } from "sonner";
import { Download, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { exportSelectedData, importData, validateImportData } from '@/utils/dataExport';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const DataExportImport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState({
    quizzes: true,
    results: true,
  });
  const { quizzes, results } = useQuiz();
  
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
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
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
        // Complete progress
        setProgress(100);
        setTimeout(() => {
          toast.success("Données exportées avec succès");
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
        setProgress(0);
      }, 1000);
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
      setProgress(10);
      
      // Validate the file first
      const validation = await validateImportData(file);
      setProgress(40);
      
      if (!validation.isValid) {
        toast.error("Le fichier importé est invalide");
        return;
      }
      
      if (quizzes.length > 0 || results.length > 0) {
        const confirmed = window.confirm(
          "L'importation remplacera toutes vos données existantes. Êtes-vous sûr de vouloir continuer?"
        );
        if (!confirmed) {
          setIsImporting(false);
          setProgress(0);
          e.target.value = '';
          return;
        }
      }
      
      setProgress(70);
      
      await importData(file, selectedItems);
      setProgress(100);
      
      toast.success("Données importées avec succès. Rechargez la page pour voir les changements.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de l'importation: " + (error instanceof Error ? error.message : "Fichier invalide"));
    } finally {
      setTimeout(() => {
        setIsImporting(false);
        setProgress(0);
        e.target.value = '';
      }, 1000);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="export-quizzes" 
            checked={selectedItems.quizzes}
            onCheckedChange={(checked) => 
              setSelectedItems({...selectedItems, quizzes: checked === true})
            }
          />
          <label 
            htmlFor="export-quizzes" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Quiz
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="export-results" 
            checked={selectedItems.results}
            onCheckedChange={(checked) => 
              setSelectedItems({...selectedItems, results: checked === true})
            }
          />
          <label 
            htmlFor="export-results" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Résultats
          </label>
        </div>
      </div>
    
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Exportation...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Exporter les données</span>
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleImportClick}
          disabled={isImporting}
          className="flex items-center gap-2"
        >
          {isImporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Importation...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Importer des données</span>
            </>
          )}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          className="hidden"
          accept=".json"
        />
      </div>
      
      {(isImporting || isExporting) && progress > 0 && (
        <Progress value={progress} className="w-full mt-2" />
      )}
    </div>
  );
};

export default DataExportImport;
