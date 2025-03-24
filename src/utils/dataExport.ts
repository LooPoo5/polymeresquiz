
/**
 * Utilitaires pour l'exportation et l'importation des données de l'application
 */

// Clés de stockage localStorage
const QUIZZES_STORAGE_KEY = 'quizzes';
const RESULTS_STORAGE_KEY = 'quiz-results';

/**
 * Exporte toutes les données (quiz et résultats) dans un fichier JSON
 */
export const exportAllData = () => {
  try {
    const quizzes = localStorage.getItem(QUIZZES_STORAGE_KEY);
    const results = localStorage.getItem(RESULTS_STORAGE_KEY);
    
    const exportData = {
      quizzes: quizzes ? JSON.parse(quizzes) : [],
      results: results ? JSON.parse(results) : []
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quiz-app-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'exportation des données:', error);
    return false;
  }
};

/**
 * Importe les données depuis un fichier JSON
 * @param file Le fichier JSON contenant les données
 * @returns Une promesse qui résout à true si l'importation a réussi
 */
export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Format de fichier invalide');
        }
        
        const importedData = JSON.parse(result);
        
        // Vérification de la structure des données
        if (!importedData.quizzes || !Array.isArray(importedData.quizzes)) {
          throw new Error('Le fichier ne contient pas de quiz valides');
        }
        
        // Convertir les dates string en objets Date
        const quizzesWithDates = importedData.quizzes.map((quiz: any) => ({
          ...quiz,
          createdAt: new Date(quiz.createdAt)
        }));
        
        let resultsWithDates = [];
        if (importedData.results && Array.isArray(importedData.results)) {
          resultsWithDates = importedData.results.map((result: any) => ({
            ...result,
            startTime: new Date(result.startTime),
            endTime: new Date(result.endTime)
          }));
        }
        
        // Sauvegarder dans localStorage
        localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzesWithDates));
        localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(resultsWithDates));
        
        resolve(true);
      } catch (error) {
        console.error('Erreur lors de l\'importation des données:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur de lecture du fichier'));
    };
    
    reader.readAsText(file);
  });
};
