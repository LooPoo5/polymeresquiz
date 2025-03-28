
/**
 * Utilities for managing import/export history
 */

import { EXPORT_HISTORY_KEY, IMPORT_HISTORY_KEY } from './exportImport';

/**
 * Save export action to history
 */
export const saveToExportHistory = (dataTypes: string[]) => {
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
export const saveToImportHistory = (fileName: string, dataTypes: string[], counts: { quizCount: number, resultCount: number }) => {
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
