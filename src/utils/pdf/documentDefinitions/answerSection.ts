
import { QuizResult, Question } from '@/context/types';
import { Content } from 'pdfmake/interfaces';

/**
 * Creates the answers section for the quiz PDF
 */
export const createAnswerSection = (
  result: QuizResult,
  quizQuestions: Record<string, Question>,
  maxAnswersToInclude: number = 30
): Content[] => {
  const documentContent: Content[] = [
    // Answers section header
    { 
      text: 'Détail des réponses', 
      style: 'sectionHeader', 
      margin: [0, 0, 0, 10] as [number, number, number, number] 
    }
  ];
  
  // Process a limited number of answers to avoid timeouts
  const answersToProcess = result.answers.slice(0, maxAnswersToInclude);
  
  // Process answers and add them to the content array
  answersToProcess.forEach((answer, index) => {
    const question = quizQuestions[answer.questionId];
    if (!question) return;
    
    // Create answer content
    const answerContent: Content[] = [];
    
    // Check if answer is correct to show checkmark
    const isCorrect = answer.points > 0;
    const scoreText = `${answer.points}/${question.points || 1}`;
    
    // Add question with score and checkmark if correct
    const questionContent = {
      columns: [
        { 
          text: `Question ${index + 1}: ${question.text}`, 
          style: 'questionText', 
          width: '*' 
        },
        { 
          columns: [
            { 
              text: scoreText, 
              style: 'points', 
              width: 'auto',
              margin: [0, 0, 5, 0] as [number, number, number, number] 
            },
            isCorrect ? {
              canvas: [
                {
                  type: 'ellipse',
                  x: 8,
                  y: 8,
                  r1: 8,
                  r2: 8,
                  color: '#10b981',
                  fillOpacity: 1
                }
              ],
              width: 16,
              margin: [0, -2, 0, 0] as [number, number, number, number]
            } : { text: '' }
          ],
          width: 'auto'
        }
      ],
      margin: [0, 0, 0, 5] as [number, number, number, number]
    };
    
    answerContent.push({ text: 'Réponses :', style: 'label', margin: [0, 5, 0, 3] as [number, number, number, number] });
    
    if (question.type === 'open-ended') {
      answerContent.push({ 
        text: answer.answerText || "Sans réponse", 
        margin: [0, 0, 0, 5] as [number, number, number, number] 
      });
    } else {
      const answerIds = answer.answerIds || (answer.answerId ? [answer.answerId] : []);
      
      // Optimize: Add each answer option, limit to 15 options max per question
      const optionsToShow = question.answers.slice(0, 15);
      optionsToShow.forEach(option => {
        const isSelected = answerIds.includes(option.id);
        const color = isSelected 
          ? (option.isCorrect ? '#10b981' : '#ef4444') 
          : '#000000';
          
        answerContent.push({ 
          columns: [
            {
              canvas: [
                {
                  type: 'ellipse',
                  x: 5,
                  y: 5,
                  r1: 5,
                  r2: 5,
                  lineColor: color,
                  lineWidth: 1,
                  fillOpacity: isSelected ? 1 : 0,
                  color: isSelected ? color : undefined // Using 'color' instead of 'fillColor'
                }
              ],
              width: 10,
              margin: [0, 3, 5, 0] as [number, number, number, number]
            },
            { 
              text: option.text,
              color: isSelected ? color : 'black',
              width: '*'
            }
          ],
          margin: [0, 2, 0, 2] as [number, number, number, number]
        });
      });
    }
    
    // Add this question and its answers to the content
    documentContent.push({
      stack: [
        questionContent,
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
  
  return documentContent;
};
