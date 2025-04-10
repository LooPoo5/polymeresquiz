
import { QuizResult, Question } from '@/context/types';
import { Content, Column } from 'pdfmake/interfaces';

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
    
    // Calculate total possible points for the question
    const totalPossiblePoints = calculateTotalPointsForQuestion(question);
    
    // Create answer content
    const answerContent: Content[] = [];
    
    // Add question with score
    const questionColumns: Column[] = [
      { 
        text: `Question ${index + 1}: ${question.text}`, 
        style: 'questionText', 
        width: '*' 
      },
      { 
        text: `${answer.points}/${totalPossiblePoints}`, 
        style: 'points', 
        width: 'auto'
      }
    ];
    
    const questionContent: Content = {
      columns: questionColumns,
      margin: [0, 0, 0, 5] as [number, number, number, number]
    };
    
    answerContent.push({ 
      text: 'Réponses :',
      style: 'label',
      margin: [0, 5, 0, 3] as [number, number, number, number]
    });
    
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
        
        // Determine color based on selection and correctness
        let color = '#000000'; // Default black
        if (isSelected && option.isCorrect) {
          color = '#10b981'; // Green for correct selected
        } else if (isSelected && !option.isCorrect) {
          color = '#ef4444'; // Red for incorrect selected
        } else if (!isSelected && option.isCorrect) {
          color = '#F97316'; // Orange for correct not selected
        }
        
        // Add points information for correct answers
        const pointsText = option.isCorrect && option.points > 0 
          ? ` (${option.points} pt${option.points > 1 ? 's' : ''})`
          : '';
          
        const answerColumns: Column[] = [
          {
            canvas: [
              {
                type: 'ellipse',
                x: 3,
                y: 3,
                r1: 3,
                r2: 3,
                lineColor: color,
                lineWidth: 1,
                fillOpacity: isSelected ? 1 : 0,
                color: isSelected ? color : undefined
              }
            ],
            width: 6,
            margin: [0, 3, 5, 0] as [number, number, number, number]
          },
          { 
            text: option.text + pointsText,
            color: color,
            width: '*'
          }
        ];
        
        answerContent.push({ 
          columns: answerColumns,
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
      ] as Content[],
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

// Helper function to calculate total possible points for a question
const calculateTotalPointsForQuestion = (question: Question): number => {
  if (question.type === 'open-ended') {
    return question.points || 1;
  } else if (question.type === 'multiple-choice') {
    const correctAnswer = question.answers.find(a => a.isCorrect);
    return correctAnswer?.points || question.points || 1;
  } else {
    const correctAnswersPoints = question.answers
      .filter(a => a.isCorrect)
      .reduce((sum, a) => sum + (a.points || 1), 0);
    return correctAnswersPoints > 0 ? correctAnswersPoints : question.points || 1;
  }
};
