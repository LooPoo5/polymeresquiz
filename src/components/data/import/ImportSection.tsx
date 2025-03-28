
import React, { useState, useRef } from 'react';
import { toast } from "sonner";
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { importData, validateImportData } from '@/utils/data';
import { useQuiz } from '@/context/QuizContext';
import DataValidationStatus from '../DataValidationStatus';

interface ImportSectionProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
}

const ImportSection = ({ selectedItems }: ImportSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
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
      
      <DataValidationStatus status={validationStatus} />
      
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

export default ImportSection;
