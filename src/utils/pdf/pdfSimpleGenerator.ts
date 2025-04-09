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
 * This version is optimized for speed and reliability, with a limit on content
 * to avoid timeouts
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
    
    console.log("Démarrage de la génération du PDF...");
    
    // Format filename with participant name, date and quiz title (keeping spaces)
    const filename = `${result.participant.name} ${result.participant.date} ${result.quizTitle}.pdf`;
    
    // Create document definition using our utility
    const docDefinition = createSimpleQuizDocDefinition(result, quizQuestions, metrics);
    
    console.log("Définition du document PDF prête, lancement du téléchargement...");
    
    // Handle download with dedicated downloader
    downloadPdfDocument(
      docDefinition,
      filename,
      () => {
        console.log("PDF généré et téléchargé avec succès");
        setIsGenerating(false);
      },
      () => {
        console.log("Génération PDF interrompue - timeout ou erreur");
        setIsGenerating(false);
      }
    );
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error("Erreur lors de la génération du PDF");
    setIsGenerating(false);
  }
};
