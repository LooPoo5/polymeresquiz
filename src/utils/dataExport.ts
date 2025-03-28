
/**
 * Utilitaires pour l'exportation et l'importation des données de l'application
 */

// Clés de stockage localStorage
const QUIZZES_STORAGE_KEY = 'quizzes';
const RESULTS_STORAGE_KEY = 'quiz-results';
const EXPORT_HISTORY_KEY = 'export-history';
const IMPORT_HISTORY_KEY = 'import-history';

/**
 * Exporte les données sélectionnées (quiz, résultats ou les deux) dans un fichier JSON
 */
export const exportSelectedData = async (dataTypes: string[] = ['quizzes', 'results']): Promise<boolean> => {
  try {
    const exportData: { quizzes?: any[], results?: any[] } = {};
    
    // Export quizzes if selected
    if (dataTypes.includes('quizzes')) {
      const quizzes = localStorage.getItem(QUIZZES_STORAGE_KEY);
      exportData.quizzes = quizzes ? JSON.parse(quizzes) : [];
    }
    
    // Export results if selected
    if (dataTypes.includes('results')) {
      const results = localStorage.getItem(RESULTS_STORAGE_KEY);
      exportData.results = results ? JSON.parse(results) : [];
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quiz-app-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Save to export history
    saveToExportHistory(dataTypes);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'exportation des données:', error);
    return false;
  }
};

/**
 * Save export action to history
 */
const saveToExportHistory = (dataTypes: string[]) => {
  try {
    const now = new Date();
    const historyItem = {
      date: now.toISOString(),
      items: dataTypes
    };
    
    // Get existing history
    const historyJSON = localStorage.getItem(EXPORT_HISTORY_KEY);
    let history = historyJSON ? JSON.parse(historyJSON) : [];
    
    // Add new item at the beginning
    history = [historyItem, ...history.slice(0, 9)]; // Keep only 10 items
    
    // Save back to localStorage
    localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'historique d\'exportation:', error);
  }
};

/**
 * Save import action to history
 */
const saveToImportHistory = (fileName: string, dataTypes: string[], counts: { quizCount: number, resultCount: number }) => {
  try {
    const now = new Date();
    const historyItem = {
      date: now.toISOString(),
      fileName,
      items: dataTypes,
      counts
    };
    
    // Get existing history
    const historyJSON = localStorage.getItem(IMPORT_HISTORY_KEY);
    let history = historyJSON ? JSON.parse(historyJSON) : [];
    
    // Add new item at the beginning
    history = [historyItem, ...history.slice(0, 9)]; // Keep only 10 items
    
    // Save back to localStorage
    localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'historique d\'importation:', error);
  }
};

/**
 * Get import history
 */
export const getImportHistory = (): { date: string; fileName: string; items: string[]; counts: { quizCount: number, resultCount: number } }[] => {
  try {
    const historyJSON = localStorage.getItem(IMPORT_HISTORY_KEY);
    return historyJSON ? JSON.parse(historyJSON) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique d\'importation:', error);
    return [];
  }
};

/**
 * Get export history
 */
export const getExportHistory = (): { date: string; items: string[] }[] => {
  try {
    const historyJSON = localStorage.getItem(EXPORT_HISTORY_KEY);
    return historyJSON ? JSON.parse(historyJSON) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique d\'exportation:', error);
    return [];
  }
};

/**
 * Alias for backward compatibility
 */
export const exportAllData = () => exportSelectedData();

/**
 * Validates imported data before applying it
 * @param file The JSON file containing the data
 * @returns A validation result object
 */
export const validateImportData = (file: File): Promise<{
  isValid: boolean;
  message?: string;
  quizCount: number;
  resultCount: number;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          reject(new Error('Format de fichier invalide'));
          return;
        }
        
        const importedData = JSON.parse(result);
        
        // Check if the structure is valid
        if (!importedData) {
          reject(new Error('Fichier JSON invalide'));
          return;
        }
        
        // Validate quizzes if present
        let quizCount = 0;
        if (importedData.quizzes) {
          if (!Array.isArray(importedData.quizzes)) {
            reject(new Error('Le format des quiz est invalide'));
            return;
          }
          
          quizCount = importedData.quizzes.length;
          
          // Check each quiz for required fields
          for (const quiz of importedData.quizzes) {
            if (!quiz.id || !quiz.title || !Array.isArray(quiz.questions)) {
              reject(new Error('Un ou plusieurs quiz sont invalides'));
              return;
            }
          }
        }
        
        // Validate results if present
        let resultCount = 0;
        if (importedData.results) {
          if (!Array.isArray(importedData.results)) {
            reject(new Error('Le format des résultats est invalide'));
            return;
          }
          
          resultCount = importedData.results.length;
          
          // Check each result for required fields
          for (const result of importedData.results) {
            if (!result.id || !result.quizId || !result.participant || !Array.isArray(result.answers)) {
              reject(new Error('Un ou plusieurs résultats sont invalides'));
              return;
            }
          }
        }
        
        // If we got here, the data is valid
        resolve({ 
          isValid: true, 
          quizCount, 
          resultCount,
          message: `Validation réussie: ${quizCount} quiz et ${resultCount} résultats`
        });
      } catch (error) {
        reject(new Error('Erreur lors de l\'analyse du fichier JSON'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur de lecture du fichier'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Imports data from a JSON file with selected options
 * @param file The JSON file containing the data
 * @param options Selection of what data to import
 * @returns A promise that resolves to true if the import was successful
 */
export const importData = (file: File, options = { quizzes: true, results: true }): Promise<{
  success: boolean;
  quizCount: number;
  resultCount: number;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          reject(new Error('Format de fichier invalide'));
          return;
        }
        
        const importedData = JSON.parse(result);
        let quizCount = 0;
        let resultCount = 0;
        const importedTypes: string[] = [];
        
        // Import quizzes if selected and present
        if (options.quizzes && importedData.quizzes && Array.isArray(importedData.quizzes)) {
          quizCount = importedData.quizzes.length;
          importedTypes.push('quizzes');
          
          // Convert dates
          const quizzesWithDates = importedData.quizzes.map((quiz: any) => ({
            ...quiz,
            createdAt: quiz.createdAt ? new Date(quiz.createdAt).toISOString() : new Date().toISOString()
          }));
          
          localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzesWithDates));
        }
        
        // Import results if selected and present
        if (options.results && importedData.results && Array.isArray(importedData.results)) {
          resultCount = importedData.results.length;
          importedTypes.push('results');
          
          // Convert dates
          const resultsWithDates = importedData.results.map((result: any) => ({
            ...result,
            startTime: result.startTime ? new Date(result.startTime).toISOString() : new Date().toISOString(),
            endTime: result.endTime ? new Date(result.endTime).toISOString() : new Date().toISOString()
          }));
          
          localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(resultsWithDates));
        }
        
        // Save to import history
        if (importedTypes.length > 0) {
          saveToImportHistory(file.name, importedTypes, { quizCount, resultCount });
        }
        
        resolve({
          success: true,
          quizCount,
          resultCount
        });
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
