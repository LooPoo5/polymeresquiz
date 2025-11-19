
/**
 * Utilitaires pour l'exportation et l'importation des données de l'application
 */

// Clés de stockage localStorage
const QUIZZES_STORAGE_KEY = 'quizzes';
const RESULTS_STORAGE_KEY = 'quiz-results';
const HISTORY_STORAGE_KEY = 'data-history';

/**
 * Sauvegarde un événement d'exportation dans l'historique
 */
const saveExportToHistory = (filename: string) => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    history.push({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      filename,
      type: 'export',
    });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans l'historique:", error);
  }
};

/**
 * Supprime une entrée de l'historique
 */
export const deleteHistoryItem = (id: string): boolean => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    const updatedHistory = history.filter((item: any) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entrée:", error);
    return false;
  }
};

/**
 * Exporte toutes les données (quiz et résultats) dans un fichier JSON
 */
export const exportAllData = () => {
  return exportSelectedData(true, true);
};

/**
 * Exporte les données sélectionnées (quiz et/ou résultats) dans un fichier JSON
 */
export const exportSelectedData = (includeQuizzes: boolean, includeResults: boolean) => {
  try {
    const exportData: {quizzes?: any[], results?: any[]} = {};
    
    if (includeQuizzes) {
      const quizzes = localStorage.getItem(QUIZZES_STORAGE_KEY);
      if (quizzes) {
        exportData.quizzes = JSON.parse(quizzes);
      } else {
        exportData.quizzes = [];
      }
    }
    
    if (includeResults) {
      const results = localStorage.getItem(RESULTS_STORAGE_KEY);
      if (results) {
        exportData.results = JSON.parse(results);
      } else {
        exportData.results = [];
      }
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quiz-app-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Save to history
    saveExportToHistory(exportFileDefaultName);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'exportation des données:', error);
    return false;
  }
};

/**
 * Importe les données depuis un fichier JSON
 * @param file Le fichier JSON contenant les données
 * @param setQuizzes Fonction pour mettre à jour l'état des quiz
 * @param setResults Fonction pour mettre à jour l'état des résultats
 * @returns Une promesse qui résout à true si l'importation a réussi
 */
export const importData = (
  file: File, 
  setQuizzes?: (quizzes: any[]) => void, 
  setResults?: (results: any[]) => void
): Promise<boolean> => {
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
        if (importedData.quizzes !== undefined && !Array.isArray(importedData.quizzes)) {
          throw new Error('Le fichier ne contient pas de quiz valides');
        }
        
        // Convertir les dates string en objets Date
        let quizzesWithDates = [];
        if (importedData.quizzes && importedData.quizzes.length > 0) {
          quizzesWithDates = importedData.quizzes.map((quiz: any) => ({
            ...quiz,
            createdAt: new Date(quiz.createdAt)
          }));
          // Sauvegarder dans localStorage
          localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzesWithDates));
          // Mettre à jour l'état React si la fonction est fournie
          if (setQuizzes) {
            setQuizzes(quizzesWithDates);
          }
        } else if (importedData.quizzes && importedData.quizzes.length === 0) {
          // Si le fichier contient un tableau vide de quiz
          localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify([]));
          if (setQuizzes) {
            setQuizzes([]);
          }
        }
        
        let resultsWithDates = [];
        if (importedData.results && importedData.results.length > 0) {
          resultsWithDates = importedData.results.map((result: any) => ({
            ...result,
            startTime: new Date(result.startTime),
            endTime: new Date(result.endTime)
          }));
          // Sauvegarder dans localStorage
          localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(resultsWithDates));
          // Mettre à jour l'état React si la fonction est fournie
          if (setResults) {
            setResults(resultsWithDates);
          }
        } else if (importedData.results && importedData.results.length === 0) {
          // Si le fichier contient un tableau vide de résultats
          localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify([]));
          if (setResults) {
            setResults([]);
          }
        }
        
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
