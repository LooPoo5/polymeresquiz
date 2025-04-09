
import { toast } from "sonner";
import { QuizResult, Question } from '@/context/QuizContext';
import { PdfMetrics } from '@/components/quiz-results/pdf-template/types';
import { savePdfDirectly } from '@/utils/pdf/pdfConverter';

/**
 * Generates a PDF for quiz results
 */
export const generateQuizResultsPdf = async (
  result: QuizResult,
  quizQuestions: Record<string, Question>,
  metrics: PdfMetrics,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  if (!result || !quizQuestions || !metrics) return;
  
  try {
    setIsGenerating(true);
    toast.info("Préparation du PDF...");
    
    // 1. Format du nom de fichier avec le nom du participant, date et titre du quiz
    const filename = `${result.participant.name} ${result.participant.date} ${result.quizTitle}.pdf`;
    
    // 2. Créer un élément de conteneur PDF en dehors du DOM visible
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-container';
    pdfContainer.style.position = 'fixed';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '210mm'; // Largeur A4
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '15mm';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(pdfContainer);
    
    // 3. Construire directement le HTML pour le PDF (version simplifiée)
    pdfContainer.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: black; background-color: white;">
        <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: black;">Résultats du quiz</h1>
        <h2 style="font-size: 16px; margin-bottom: 16px; color: black;">${result.quizTitle}</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="flex: 1; border: 1px solid #eee; padding: 15px; margin-right: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: black;">Informations du participant</h3>
            <div style="margin-bottom: 5px;"><span style="font-weight: bold; color: black;">Nom:</span> ${result.participant.name}</div>
            <div style="margin-bottom: 5px;"><span style="font-weight: bold; color: black;">Date:</span> ${result.participant.date}</div>
            <div style="margin-bottom: 5px;"><span style="font-weight: bold; color: black;">Formateur:</span> ${result.participant.instructor || ''}</div>
          </div>
          
          <div style="flex: 1; border: 1px solid #eee; padding: 15px; margin-left: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: black;">Résumé des résultats</h3>
            <div style="margin-bottom: 5px;"><span style="font-weight: bold; color: black;">Note:</span> ${metrics.scoreOn20.toFixed(1)}/20</div>
            <div style="margin-bottom: 5px;"><span style="font-weight: bold; color: black;">Taux de réussite:</span> ${metrics.successRate}%</div>
            <div style="margin-bottom: 5px;"><span style="font-weight: bold; color: black;">Temps total:</span> ${Math.floor(metrics.durationInSeconds / 60)}min ${metrics.durationInSeconds % 60}s</div>
            <div style="margin-bottom: 5px;"><span style="font-weight: bold; color: black;">Points:</span> ${result.totalPoints}/${result.maxPoints}</div>
          </div>
        </div>
        
        <h3 style="font-weight: bold; margin-bottom: 10px; color: black;">Détail des réponses</h3>
        ${result.answers.map((answer, index) => {
          const question = quizQuestions[answer.questionId];
          if (!question) return '';
          
          // Déterminer le type de question et formater les réponses en conséquence
          let answerContent = '';
          
          if (question.type === 'open-ended') {
            answerContent = `
              <div style="margin-left: 15px; margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 5px; color: black;">Réponse:</div>
                <div style="border: 1px solid #eee; padding: 8px;">${answer.answerText || "Sans réponse"}</div>
              </div>
            `;
          } else {
            const answerIds = answer.answerIds || (answer.answerId ? [answer.answerId] : []);
            
            answerContent = `
              <div style="margin-left: 15px; margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 5px; color: black;">Réponses:</div>
                ${question.answers.map(option => {
                  const isSelected = answerIds.includes(option.id);
                  const color = isSelected 
                    ? (option.isCorrect ? 'green' : 'red')
                    : 'black';
                  
                  return `
                    <div style="margin-bottom: 5px; color: ${color} !important;">
                      ${isSelected ? '✓' : '○'} ${option.text}
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }
          
          return `
            <div style="border-bottom: 1px solid #eee; margin-bottom: 15px; padding-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <div style="font-weight: bold; color: black;">Q${index + 1}: ${question.text}</div>
                <div style="color: black;">${answer.points}/${question.points || 1}</div>
              </div>
              ${answerContent}
            </div>
          `;
        }).join('')}
        
        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
          Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}
        </div>
      </div>
    `;
    
    // 4. Attendre un court délai pour le rendu complet
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 5. Générer et télécharger le PDF
    await savePdfDirectly(
      pdfContainer, 
      filename,
      () => {
        // Nettoyer les éléments temporaires
        setTimeout(() => {
          document.body.removeChild(pdfContainer);
          setIsGenerating(false);
        }, 500);
      },
      (error) => {
        console.error("Erreur lors de la génération du PDF:", error);
        document.body.removeChild(pdfContainer);
        setIsGenerating(false);
        toast.error("Erreur lors de la génération du PDF");
      }
    );
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error("Erreur lors de la génération du PDF");
    setIsGenerating(false);
  }
};
