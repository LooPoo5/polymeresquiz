
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
  
  return documentContent;
};
