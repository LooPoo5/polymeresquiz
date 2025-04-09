
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

/**
 * Initializes pdfMake with the required fonts
 */
export const initializePdfFonts = (): void => {
  // Properly initialize the virtual file system for fonts
  pdfMake.vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any);
};
