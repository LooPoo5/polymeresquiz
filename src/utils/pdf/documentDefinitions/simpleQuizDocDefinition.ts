
import { QuizResult, Question } from '@/context/types';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { createDocumentStyles } from './quizPdfStyles';
import { createHeaderSection } from './headerSection';
import { createParticipantSection } from './participantSection';
import { createAnswerSection } from './answerSection';
import { createFooterSection } from './footerSection';

/**
 * Creates a document definition object for a simplified quiz results PDF
 */
export const createSimpleQuizDocDefinition = (
  result: QuizResult,
  quizQuestions: Record<string, Question>,
  metrics: PdfMetrics
): TDocumentDefinitions => {
  // Maximum number of answers to include to prevent timeouts
  const maxAnswersToInclude = 30;
  
  // Create properly typed content array
  const documentContent: Content[] = [
    // Add header section
    ...createHeaderSection(result),
    
    // Add participant and score info
    createParticipantSection(result, metrics),
    
    // Add answers section
    ...createAnswerSection(result, quizQuestions, maxAnswersToInclude),
    
    // Add footer (now empty)
    createFooterSection()
  ];
  
  // Return document definition
  return {
    content: documentContent,
    
    // Define document styles
    styles: createDocumentStyles(),
    
    // Define default font and page margins
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      color: '#333333'
    },
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
    pageSize: 'A4',
  };
};
