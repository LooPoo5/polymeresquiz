
import React from 'react';
import { toast } from "sonner";
import { FileDown, FileUp, AlertCircle } from 'lucide-react';
import { exportAllData, importData } from '@/utils/dataExport';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DataPage = () => {
  const [isImporting, setIsImporting] = React.useState(false);
  const { quizzes, results } = useQuiz();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Gestion des données</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="export">Exporter les données</TabsTrigger>
            <TabsTrigger value="import">Importer des données</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4">
            <div className="flex flex-col items-center text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
              <FileDown size={48} className="text-brand-red mb-4" />
              <h2 className="text-xl font-semibold mb-2">Exporter toutes les données</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Cette opération exportera tous vos quiz et résultats dans un fichier JSON 
                que vous pourrez sauvegarder et importer ultérieurement.
              </p>
              
              <Button 
                variant="default" 
                onClick={handleExport}
                className="bg-brand-red hover:bg-opacity-90 flex items-center gap-2"
              >
                <FileDown size={16} />
                <span>Télécharger les données</span>
              </Button>
              
              {(quizzes.length === 0 && results.length === 0) && (
                <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm">
                  <AlertCircle size={16} />
                  <span>Aucune donnée à exporter pour le moment</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="flex flex-col items-center text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
              <FileUp size={48} className="text-brand-red mb-4" />
              <h2 className="text-xl font-semibold mb-2">Importer des données</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Cette opération importera des quiz et résultats depuis un fichier JSON précédemment exporté.
                <strong className="block mt-2 text-amber-600">Attention: Cette action remplacera toutes les données existantes.</strong>
              </p>
              
              <Button 
                variant="outline" 
                onClick={handleImportClick}
                className="flex items-center gap-2"
                disabled={isImporting}
              >
                <FileUp size={16} />
                <span>{isImporting ? 'Importation...' : 'Sélectionner un fichier'}</span>
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                className="hidden"
                accept=".json"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataPage;
