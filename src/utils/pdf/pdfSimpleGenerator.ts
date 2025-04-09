
import { toast } from "sonner";
import { QuizResult, Question } from '@/context/types';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';
import { createSimpleQuizDocDefinition } from './documentDefinitions/simpleQuizDocDefinition';
import { downloadPdfDocument } from './pdfDownloader';
import { initializePdfFonts } from './pdfFontConfig';

// Initialize fonts when module is loaded
initializePdfFonts();

/**
 * Generates a simplified PDF document for quiz results using pdfmake
 * This version is optimized for speed and reliability
 */
export const generateSimplifiedQuizPdf = (
  result: QuizResult,
  quizQuestions: Record<string, Question>,
  metrics: PdfMetrics,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (!result || !quizQuestions || !metrics) return;
  
  try {
    setIsGenerating(true);
    toast.info("Préparation du PDF...");
    
    // Format filename with participant name, date and quiz title
    const filename = `${result.participant.name}_${result.quizTitle}.pdf`;
    
    // Create document definition using our utility
    const docDefinition = createSimpleQuizDocDefinition(result, quizQuestions, metrics);
    
    // Handle download with dedicated downloader
    downloadPdfDocument(
      docDefinition,
      filename,
      () => setIsGenerating(false),
      () => setIsGenerating(false)
    );
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error("Erreur lors de la génération du PDF");
    setIsGenerating(false);
  }
};
