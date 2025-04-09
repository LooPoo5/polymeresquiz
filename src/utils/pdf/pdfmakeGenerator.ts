
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { QuizResult, Question } from '@/context/types';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';
import { toast } from "sonner";

// Initialize pdfmake with the fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
    
    // Define document content
    const docDefinition: TDocumentDefinitions = {
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
        },
        
        // Answers section
        { text: 'Détail des réponses', style: 'sectionHeader', margin: [0, 0, 0, 10] },
        
        // Generate answer details for each question
        ...result.answers.map((answer, index) => {
          const question = quizQuestions[answer.questionId];
          if (!question) return {};
          
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
          };
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
          margin: [0, 0, 0, 10],
          padding: [0, 5, 0, 5],
          borderBottom: { width: 0.5, color: '#ccc' }
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
    
    // Create PDF document
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    // Download PDF with proper filename
    pdfDoc.download(filename, () => {
      toast.success("PDF téléchargé avec succès");
      setIsGenerating(false);
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error("Erreur lors de la génération du PDF");
    setIsGenerating(false);
  }
};
