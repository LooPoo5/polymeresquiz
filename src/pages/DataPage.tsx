import React from 'react';
import { toast } from "sonner";
import { Download, Upload, AlertCircle } from 'lucide-react';
import { exportAllData, importData } from '@/utils/dataExport';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
const DataPage = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = React.useState(false);
  const {
    quizzes,
    results
  } = useQuiz();
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
        const confirmed = window.confirm("L'importation remplacera toutes vos données existantes. Êtes-vous sûr de vouloir continuer?");
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
  return <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Gestion des Données</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4 text-brand-red">
          <AlertCircle size={20} />
          <h2 className="text-lg font-semibold">Importation et Exportation</h2>
        </div>
        
        <p className="mb-6 text-gray-600">Vous pouvez exporter toutes vos données (quiz et résultats) dans un fichier JSON que vous pourrez importer ultérieurement.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
            
            
            
            <Button onClick={handleExport} variant="outline" className="w-full flex items-center justify-center gap-2 py-[50px] font-normal text-xl text-inherit bg-red-500 hover:bg-red-400">
              <Upload size={16} />
              <span className="font-normal">Exporter les données</span>
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
            
            
            
            <Button onClick={handleImportClick} variant="outline" disabled={isImporting} className="w-full flex items-center justify-center gap-2 py-[50px] text-xl bg-red-500 hover:bg-red-400">
              <Download size={16} />
              <span className="font-normal">{isImporting ? 'Importation...' : 'Importer des données'}</span>
            </Button>
            
            <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
          </div>
        </div>
        
        {(quizzes.length > 0 || results.length > 0) && <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <AlertCircle size={16} className="bg-inherit" />
              <p className="font-medium">Attention</p>
            </div>
            <p className="text-amber-700 text-sm">L'importation remplace toutes vos données existantes. Assurez-vous d'avoir exporté celles-ci si vous souhaitez les conserver.</p>
          </div>}
      </div>
    </div>;
};
export default DataPage;