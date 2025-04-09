
import { Content } from 'pdfmake/interfaces';

/**
 * Creates the footer section for the quiz PDF
 * Now returns an empty object since we don't want the date
 */
export const createFooterSection = (): Content => {
  // Return empty content instead of the date
  return { text: '' };
};
