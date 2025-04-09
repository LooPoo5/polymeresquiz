
import { QuizResult } from '@/context/types';
import { Content } from 'pdfmake/interfaces';

/**
 * Creates the header section for the quiz PDF
 */
export const createHeaderSection = (result: QuizResult): Content[] => {
  return [
    // Header
    { 
      text: 'Résultats du quiz', 
      style: 'header', 
      margin: [0, 0, 0, 5] as [number, number, number, number] 
    },
    { 
      text: result.quizTitle, 
      style: 'subheader', 
      margin: [0, 0, 0, 10] as [number, number, number, number] 
    }
  ];
};
