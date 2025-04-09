
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
  // Prepare signature image if available
  const signatureContent = result.participant.signature ? {
    image: result.participant.signature,
    width: 100,
    height: 40,
  } : { text: '', margin: [0, 20, 0, 0] };

  return {
    columns: [
      // Participant information
      {
        width: '*',
        stack: [
          { text: 'Informations du participant', style: 'sectionHeader' },
          { 
            table: {
              widths: ['30%', '*'],
              body: [
                [{ text: 'Nom:', bold: true }, { text: result.participant.name, bold: false }],
                [{ text: 'Date:', bold: true }, { text: result.participant.date, bold: false }],
                [{ text: 'Formateur:', bold: true }, { text: result.participant.instructor || '', bold: false }],
                [{ text: 'Signature:', bold: true }, '']
              ]
            },
            layout: 'noBorders',
            margin: [0, 5, 0, 0] as [number, number, number, number]
          },
          // Signature image placed below the table
          {
            ...signatureContent,
            margin: [30, -10, 0, 10] as [number, number, number, number]
          }
        ],
        margin: [0, 0, 10, 0] as [number, number, number, number]
      },
      
      // Score summary
      {
        width: '*',
        stack: [
          // Score display with circle
          {
            alignment: 'center',
            margin: [0, 0, 0, 5] as [number, number, number, number],
            stack: [
              {
                canvas: [
                  {
                    type: 'ellipse',
                    x: 25,
                    y: 25,
                    r1: 25,
                    r2: 25,
                    color: '#eee',
                    fillOpacity: 0.5
                  }
                ]
              },
              {
                text: `${metrics.scoreOn20.toFixed(1)}`,
                fontSize: 18,
                bold: true,
                color: '#10b981',
                margin: [0, -40, 0, 0] as [number, number, number, number],
                alignment: 'center'
              },
              {
                text: `/20`,
                fontSize: 10,
                color: '#666',
                margin: [20, -5, 0, 0] as [number, number, number, number],
                alignment: 'center'
              },
              {
                text: 'Note finale',
                fontSize: 10,
                margin: [0, 15, 0, 10] as [number, number, number, number],
                alignment: 'center'
              }
            ]
          },
          // Summary metrics
          { 
            table: {
              widths: ['60%', '40%'],
              body: [
                [
                  { text: 'Taux de réussite', bold: false },
                  { text: `${metrics.successRate}%`, bold: true, alignment: 'right' }
                ],
                [
                  { text: 'Temps total', bold: false },
                  { 
                    text: `${Math.floor(metrics.durationInSeconds / 60)}m ${metrics.durationInSeconds % 60}s`,
                    bold: true,
                    alignment: 'right'
                  }
                ],
                [
                  { text: 'Points obtenus', bold: false },
                  { text: `${result.totalPoints}/${result.maxPoints}`, bold: true, alignment: 'right' }
                ]
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
