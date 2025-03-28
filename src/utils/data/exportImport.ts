
/**
 * Core functionality for data export and import
 */

// Clés de stockage localStorage
export const QUIZZES_STORAGE_KEY = 'quizzes';
export const RESULTS_STORAGE_KEY = 'quiz-results';
export const EXPORT_HISTORY_KEY = 'export-history';
export const IMPORT_HISTORY_KEY = 'import-history';

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

/**
 * Alias for backward compatibility
 */
export const exportAllData = () => exportSelectedData();
