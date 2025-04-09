
import { QuizResult, Question } from '@/context/types';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';
import { toast } from "sonner";
import { initializePdfFonts } from './pdfFontConfig';
import { createQuizResultsDocDefinition } from './pdfDocDefinitions';
import { generateAndDownloadPdf } from './pdfGenerator';

// Initialize fonts when module is loaded
initializePdfFonts();

/**
 * Generates a PDF document for quiz results using pdfmake
 */
export const generateQuizResultsPdfWithPdfmake = async (
  result: QuizResult,
  quizQuestions: Record<string, Question>,
  metrics: PdfMetrics,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  if (!result || !quizQuestions || !metrics) return;
  
  try {
    setIsGenerating(true);
    toast.info("Préparation du PDF...");
    
    // Format filename with participant name, date and quiz title
    const filename = `${result.participant.name} ${result.participant.date} ${result.quizTitle}.pdf`;
    
    // Create document definition
    const docDefinition = createQuizResultsDocDefinition(result, quizQuestions, metrics);
    
    // Generate and download the PDF
    generateAndDownloadPdf(
      docDefinition,
      filename,
      () => setIsGenerating(false),  // Success callback
      () => setIsGenerating(false)   // Timeout callback
    );
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error("Erreur lors de la génération du PDF");
    setIsGenerating(false);
  }
};
