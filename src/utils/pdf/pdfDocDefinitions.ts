
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { QuizResult, Question } from '@/context/types';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';

/**
 * Creates a document definition object for quiz results PDF
 */
export const createQuizResultsDocDefinition = (
  result: QuizResult,
  quizQuestions: Record<string, Question>,
  metrics: PdfMetrics
): TDocumentDefinitions => {
  // Format filename with participant name, date and quiz title
  return {
    content: [
      // Header
      { text: 'Résultats du quiz', style: 'header' },
      { text: result.quizTitle, style: 'subheader', margin: [0, 0, 0, 15] },
      
      // Participant info and score summary in two columns
      {
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
                margin: [0, 5, 0, 0]
              }
            ],
            margin: [0, 0, 10, 0]
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
                margin: [0, 5, 0, 0]
              }
            ],
            margin: [10, 0, 0, 0]
          }
        ],
        style: 'boxStyle',
        margin: [0, 0, 0, 20]
      } as any,
      
      // Answers section
      { text: 'Détail des réponses', style: 'sectionHeader', margin: [0, 0, 0, 10] },
      
      // Generate answer details for each question
      ...result.answers.map((answer, index) => {
        const question = quizQuestions[answer.questionId];
        // Type assertion for compatibility
        if (!question) return { text: '' } as any;
        
        // Create answer content based on question type
        let answerContent: any[] = [];
        
        if (question.type === 'open-ended') {
          answerContent = [
            { text: 'Réponse:', style: 'label', margin: [0, 5, 0, 3] },
            { 
              text: answer.answerText || "Sans réponse", 
              style: 'answerText',
              margin: [0, 0, 0, 5]
            }
          ];
        } else {
          const answerIds = answer.answerIds || (answer.answerId ? [answer.answerId] : []);
          
          answerContent = [
            { text: 'Réponses:', style: 'label', margin: [0, 5, 0, 3] },
            ...question.answers.map(option => {
              const isSelected = answerIds.includes(option.id);
              const color = isSelected 
                ? (option.isCorrect ? 'green' : 'red')
                : 'black';
              
              return { 
                text: `${isSelected ? '✓' : '○'} ${option.text}`, 
                color: color,
                margin: [0, 2, 0, 2]
              };
            })
          ];
        }
        
        // Return the complete question and answer block
        return {
          stack: [
            {
              columns: [
                { text: `Q${index + 1}: ${question.text}`, style: 'questionText', width: '*' },
                { text: `${answer.points}/${question.points || 1}`, style: 'points', width: 'auto' }
              ],
              margin: [0, 0, 0, 5]
            },
            {
              stack: answerContent,
              margin: [15, 0, 0, 0]
            }
          ],
          style: 'questionBlock',
          margin: [0, 0, 0, 15]
        } as any;
      }),
      
      // Footer
      { 
        text: `Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`,
        style: 'footer',
        margin: [0, 20, 0, 0]
      }
    ],
    
    // Define document styles
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        color: '#666'
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      boxStyle: {
        margin: [0, 5, 0, 10]
      },
      questionText: {
        fontSize: 11,
        bold: true
      },
      label: {
        fontSize: 10,
        bold: true
      },
      answerText: {
        fontSize: 10,
        italics: false,
        color: '#333'
      },
      questionBlock: {
        margin: [0, 0, 0, 10]
      },
      points: {
        alignment: 'right',
        fontSize: 11
      },
      footer: {
        fontSize: 8,
        color: '#666',
        alignment: 'center'
      }
    },
    
    // Define default font and page margins
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 10
    },
    pageMargins: [40, 40, 40, 40],
  };
};
