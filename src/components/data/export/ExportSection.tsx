
import React, { useState } from 'react';
import { toast } from "sonner";
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { exportSelectedData } from '@/utils/data';
import { useQuiz } from '@/context/QuizContext';

interface ExportSectionProps {
  selectedItems: {
    quizzes: boolean;
    results: boolean;
  };
}

const ExportSection = ({ selectedItems }: ExportSectionProps) => {
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

  return (
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
  );
};

export default ExportSection;
