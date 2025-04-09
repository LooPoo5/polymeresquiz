
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

/**
 * Initializes pdfMake with the required fonts and defines the standard fonts
 */
export const initializePdfFonts = (): void => {
  // Properly initialize the virtual file system for fonts
  pdfMake.vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any);
  
  // Define the fonts available in the document
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    },
    // Fallback to Roboto which is included in pdfmake
    Helvetica: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };
};
