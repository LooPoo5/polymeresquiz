
import { QuizResult } from '@/context/types';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';
import { Content } from 'pdfmake/interfaces';

/**
 * Creates the participant and score information section for the quiz PDF
 */
export const createParticipantSection = (
  result: QuizResult,
  metrics: PdfMetrics
): Content => {
  return {
    columns: [
      // Participant information
      {
        width: '*',
        stack: [
          { text: 'Informations du participant', style: 'sectionHeader' },
          { 
            table: {
              widths: ['40%', '*'],
              body: [
                ['Nom:', { text: result.participant.name, bold: false }],
                ['Date:', { text: result.participant.date, bold: false }],
                ['Formateur:', { text: result.participant.instructor || '', bold: false }]
              ]
            },
            layout: 'noBorders',
            margin: [0, 5, 0, 0] as [number, number, number, number]
          }
        ],
        margin: [0, 0, 10, 0] as [number, number, number, number]
      },
      
      // Score summary
      {
        width: '*',
        stack: [
          { text: 'Résumé des résultats', style: 'sectionHeader' },
          { 
            table: {
              widths: ['40%', '*'],
              body: [
                ['Note:', { text: `${metrics.scoreOn20.toFixed(1)}/20`, bold: false }],
                ['Taux de réussite:', { text: `${metrics.successRate}%`, bold: false }],
                ['Temps total:', { 
                  text: `${Math.floor(metrics.durationInSeconds / 60)}min ${metrics.durationInSeconds % 60}s`,
                  bold: false
                }],
                ['Points:', { text: `${result.totalPoints}/${result.maxPoints}`, bold: false }]
              ]
            },
            layout: 'noBorders',
            margin: [0, 5, 0, 0] as [number, number, number, number]
          }
        ],
        margin: [10, 0, 0, 0] as [number, number, number, number]
      }
    ],
    margin: [0, 0, 0, 20] as [number, number, number, number]
  };
};
