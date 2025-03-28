
import React, { useState, useRef } from 'react';
import { toast } from "sonner";
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { importData, validateImportData } from '@/utils/data';
import { useQuiz } from '@/context/QuizContext';
import ProgressIndicator from './ProgressIndicator';

interface ImportButtonProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
}

const ImportButton = ({ selectedItems }: ImportButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { quizzes, results } = useQuiz();

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
    <>
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
        <ProgressIndicator isActive={isImporting} progress={progress} />
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
        accept=".json"
      />
    </>
  );
};

export default ImportButton;
