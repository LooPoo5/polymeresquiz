
import React, { useRef, useState } from 'react';
import { toast } from "sonner";
import { Download, Upload, AlertCircle } from 'lucide-react';
import { exportAllData, importData } from '@/utils/dataExport';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';

const DataExportImport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { quizzes, results } = useQuiz();
  
  const handleExport = () => {
    if (quizzes.length === 0 && results.length === 0) {
      toast.warning("Il n'y a aucune donnée à exporter");
      return;
    }
    
    const success = exportAllData();
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
      
      if (quizzes.length > 0 || results.length > 0) {
        const confirmed = window.confirm(
          "L'importation remplacera toutes vos données existantes. Êtes-vous sûr de vouloir continuer?"
        );
        if (!confirmed) {
          setIsImporting(false);
          e.target.value = '';
          return;
        }
      }
      
      await importData(file);
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
    <div className="flex flex-col sm:flex-row gap-2">
      <Button 
        variant="outline" 
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        <span>Exporter les données</span>
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleImportClick}
        className="flex items-center gap-2"
        disabled={isImporting}
      >
        <Upload size={16} />
        <span>{isImporting ? 'Importation...' : 'Importer des données'}</span>
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
        accept=".json"
      />
    </div>
  );
};

export default DataExportImport;
