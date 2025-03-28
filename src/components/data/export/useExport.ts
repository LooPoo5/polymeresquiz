
import { useState } from 'react';
import { toast } from "sonner";
import { exportSelectedData } from '@/utils/data';
import { useQuiz } from '@/context/QuizContext';

interface UseExportProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
}

interface UseExportReturn {
  isExporting: boolean;
  exportProgress: number;
  handleExport: () => Promise<void>;
}

export const useExport = ({ selectedItems }: UseExportProps): UseExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
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

  return {
    isExporting,
    exportProgress,
    handleExport,
  };
};
