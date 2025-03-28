
import React, { useState } from 'react';
import { toast } from "sonner";
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportSelectedData } from '@/utils/data';
import { useQuiz } from '@/context/QuizContext';
import ProgressIndicator from './ProgressIndicator';

interface ExportButtonProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
}

const ExportButton = ({ selectedItems }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
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

  return (
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
      <ProgressIndicator isActive={isExporting} progress={progress} />
    </Button>
  );
};

export default ExportButton;
