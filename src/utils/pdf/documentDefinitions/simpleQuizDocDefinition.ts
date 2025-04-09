
import { QuizResult, Question } from '@/context/types';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';
import { TDocumentDefinitions, StyleDictionary, Content } from 'pdfmake/interfaces';

/**
 * Creates a document definition object for a simplified quiz results PDF
 */
export const createSimpleQuizDocDefinition = (
  result: QuizResult,
  quizQuestions: Record<string, Question>,
  metrics: PdfMetrics
): TDocumentDefinitions => {
  // Create properly typed content array
  const documentContent: Content[] = [
    // Header
    { 
      text: 'Résultats du quiz', 
      style: 'header', 
      margin: [0, 0, 0, 5] as [number, number, number, number] 
    },
    { 
      text: result.quizTitle, 
      style: 'subheader', 
      margin: [0, 0, 0, 10] as [number, number, number, number] 
    },
    
    // Participant and score info
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
    },
    
    // Answers section
    { 
      text: 'Détail des réponses', 
      style: 'sectionHeader', 
      margin: [0, 0, 0, 10] as [number, number, number, number] 
    },
  ];
  
  // Process a limited number of answers to avoid timeouts
  // This is a crucial optimization for performance
  const maxAnswersToInclude = 30; // Limiter le nombre de questions pour éviter les timeouts
  const answersToProcess = result.answers.slice(0, maxAnswersToInclude);
  
  // Process answers and add them to the content array
  answersToProcess.forEach((answer, index) => {
    const question = quizQuestions[answer.questionId];
    if (!question) return;
    
    // Create answer content
    const answerContent: Content[] = [];
    
    if (question.type === 'open-ended') {
      answerContent.push(
        { 
          text: 'Réponse:', 
          style: 'label', 
          margin: [0, 5, 0, 3] as [number, number, number, number] 
        },
        { 
          text: answer.answerText || "Sans réponse", 
          margin: [0, 0, 0, 5] as [number, number, number, number] 
        }
      );
    } else {
      const answerIds = answer.answerIds || (answer.answerId ? [answer.answerId] : []);
      
      answerContent.push(
        { 
          text: 'Réponses:', 
          style: 'label', 
          margin: [0, 5, 0, 3] as [number, number, number, number] 
        }
      );
      
      // Optimize: Add each answer option, limit to 15 options max per question
      const optionsToShow = question.answers.slice(0, 15);
      optionsToShow.forEach(option => {
        const isSelected = answerIds.includes(option.id);
        answerContent.push({ 
          text: `${isSelected ? '✓' : '○'} ${option.text}`,
          color: isSelected ? (option.isCorrect ? 'green' : 'red') : 'black',
          margin: [0, 2, 0, 2] as [number, number, number, number]
        });
      });
    }
    
    // Skip large images to improve performance
    const hasImage = question.imageUrl && question.imageUrl.length > 0;
    const isLargeImage = hasImage && question.imageUrl.length > 100000;
    
    // Add this question and its answers to the content
    documentContent.push({
      stack: [
        {
          columns: [
            { 
              text: `Q${index + 1}: ${question.text}`, 
              style: 'questionText', 
              width: '*' 
            },
            { 
              text: `${answer.points}/${question.points || 1}`, 
              style: 'points', 
              width: 'auto' 
            }
          ],
          margin: [0, 0, 0, 5] as [number, number, number, number]
        },
        {
          stack: answerContent,
          margin: [15, 0, 0, 0] as [number, number, number, number]
        }
      ],
      style: 'questionBlock',
      margin: [0, 0, 0, 15] as [number, number, number, number]
    });
  });
  
  // Add note if we limited the number of answers
  if (result.answers.length > maxAnswersToInclude) {
    documentContent.push({ 
      text: `Note: Seules les ${maxAnswersToInclude} premières questions sont affichées pour optimiser les performances.`,
      style: 'note',
      margin: [0, 10, 0, 10] as [number, number, number, number]
    });
  }
  
  // Add footer
  documentContent.push({ 
    text: `Document généré le ${new Date().toLocaleDateString()}`,
    style: 'footer',
    margin: [0, 20, 0, 0] as [number, number, number, number]
  });
  
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
  };
};

/**
 * Creates styles for the document
 */
export const createDocumentStyles = (): StyleDictionary => {
  return {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 5] as [number, number, number, number],
      color: '#000000'
    },
    subheader: {
      fontSize: 14,
      bold: true,
      color: '#666666',
      margin: [0, 0, 0, 5] as [number, number, number, number]
    },
    sectionHeader: {
      fontSize: 12,
      bold: true,
      margin: [0, 0, 0, 5] as [number, number, number, number],
      color: '#000000'
    },
    questionText: {
      fontSize: 11,
      bold: true,
      color: '#000000'
    },
    label: {
      fontSize: 10,
      bold: true,
      color: '#000000'
    },
    questionBlock: {
      margin: [0, 0, 0, 10] as [number, number, number, number],
      // Fix: Replace borderBottom with proper decoration
      decoration: 'underline',
      decorationStyle: 'solid',
      decorationColor: '#eeeeee'
    },
    points: {
      alignment: 'right',
      fontSize: 11,
      color: '#333333'
    },
    note: {
      fontSize: 9,
      italics: true,
      color: '#666666'
    },
    footer: {
      fontSize: 8,
      color: '#666666',
      alignment: 'center'
    }
  };
};
