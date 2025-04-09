
import { Content } from 'pdfmake/interfaces';

/**
 * Creates the footer section for the quiz PDF
 */
export const createFooterSection = (): Content => {
  return { 
    text: `Document généré le ${new Date().toLocaleDateString()}`,
    style: 'footer',
    margin: [0, 20, 0, 0] as [number, number, number, number]
  };
};
