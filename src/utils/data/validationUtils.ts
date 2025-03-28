
/**
 * Utilities for validating import data
 */

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
