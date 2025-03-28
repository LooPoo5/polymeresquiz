
import { useState } from 'react';
import { toast } from "sonner";
import { importData, validateImportData } from '@/utils/data';
import { useQuiz } from '@/context/QuizContext';

interface ImportStatus {
  isImporting: boolean;
  importProgress: number;
  validationStatus: {
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  };
}

export const useFileImport = (selectedItems: { quizzes: boolean; results: boolean; }) => {
  const [status, setStatus] = useState<ImportStatus>({
    isImporting: false,
    importProgress: 0,
    validationStatus: {
      isValidating: false,
      isValid: null,
      message: '',
    }
  });

  const { quizzes, results, refreshData } = useQuiz();

  const handleValidateFile = async (file: File) => {
    setStatus(prev => ({
      ...prev,
      validationStatus: { isValidating: true, isValid: null, message: 'Validation en cours...' }
    }));
    
    try {
      const validationResult = await validateImportData(file);
      
      if (validationResult.isValid) {
        setStatus(prev => ({
          ...prev,
          validationStatus: { 
            isValidating: false, 
            isValid: true, 
            message: `Fichier valide: ${validationResult.quizCount} quiz et ${validationResult.resultCount} résultats`
          }
        }));
        return validationResult;
      } else {
        setStatus(prev => ({
          ...prev,
          validationStatus: { 
            isValidating: false, 
            isValid: false, 
            message: validationResult.message || 'Fichier invalide'
          }
        }));
        return null;
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        validationStatus: { 
          isValidating: false, 
          isValid: false, 
          message: error instanceof Error ? error.message : 'Erreur de validation'
        }
      }));
      return null;
    }
  };

  const handleImport = async (file: File) => {
    if (!file) return;
    
    try {
      setStatus(prev => ({ ...prev, isImporting: true, importProgress: 10 }));
      
      const validationResult = await handleValidateFile(file);
      setStatus(prev => ({ ...prev, importProgress: 30 }));
      
      if (!validationResult) {
        toast.error("Le fichier importé est invalide");
        setStatus(prev => ({ ...prev, isImporting: false, importProgress: 0 }));
        return false;
      }
      
      setStatus(prev => ({ ...prev, importProgress: 50 }));
      
      if (quizzes.length > 0 || results.length > 0) {
        const confirmed = window.confirm(
          "L'importation remplacera toutes vos données existantes. Êtes-vous sûr de vouloir continuer?"
        );
        if (!confirmed) {
          setStatus(prev => ({ 
            ...prev, 
            isImporting: false, 
            importProgress: 0,
            validationStatus: { isValidating: false, isValid: null, message: '' }
          }));
          return false;
        }
      }
      
      setStatus(prev => ({ ...prev, importProgress: 70 }));
      
      const result = await importData(file, selectedItems);
      
      setStatus(prev => ({ ...prev, importProgress: 100 }));
      
      toast.success(`Données importées avec succès: ${result.quizCount} quiz et ${result.resultCount} résultats`);
      
      refreshData();
      return true;
      
    } catch (error) {
      toast.error("Erreur lors de l'importation: " + (error instanceof Error ? error.message : "Fichier invalide"));
      return false;
    } finally {
      setTimeout(() => {
        setStatus(prev => ({ 
          ...prev, 
          isImporting: false, 
          importProgress: 0 
        }));
      }, 1000);
    }
  };

  return {
    status,
    handleImport
  };
};
