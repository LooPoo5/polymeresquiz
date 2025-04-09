
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
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '210mm'; // Largeur A4
    pdfContainer.style.height = 'auto';
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '15mm';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(pdfContainer);
    
    // 3. Construire directement le HTML pour le PDF avec la mise en page améliorée
    pdfContainer.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: black; background-color: white;">
        <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 4px; color: black;">Résultats du quiz</h1>
        <h2 style="font-size: 16px; margin-bottom: 16px; color: black;">${result.quizTitle}</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="flex: 1; border: 1px solid #eee; padding: 15px; margin-right: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: black;">Informations du participant</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 3px 0; font-weight: bold; width: 30%; color: black;">Nom:</td>
                <td style="padding: 3px 0; color: black;">${result.participant.name}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: bold; color: black;">Date:</td>
                <td style="padding: 3px 0; color: black;">${result.participant.date}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: bold; color: black;">Formateur:</td>
                <td style="padding: 3px 0; color: black;">${result.participant.instructor || ''}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: bold; color: black;">Signature:</td>
                <td style="padding: 3px 0;"></td>
              </tr>
            </table>
            ${result.participant.signature ? `
              <div style="margin-top: 5px;">
                <img src="${result.participant.signature}" style="width: 150px; max-height: 60px;" />
              </div>
            ` : ''}
          </div>
          
          <div style="flex: 1; padding: 15px; margin-left: 10px; display: flex; flex-direction: column; align-items: center;">
            <div style="text-align: center; margin-bottom: 15px;">
              <div style="position: relative; display: inline-block;">
                <div style="position: relative; width: 80px; height: 80px; border-radius: 50%; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center;">
                  <div style="position: absolute; color: #10b981; font-size: 26px; font-weight: bold;">${metrics.scoreOn20.toFixed(1)}</div>
                  <div style="position: absolute; top: 45px; left: 45px; color: #666; font-size: 12px;">/20</div>
                </div>
              </div>
              <div style="margin-top: 5px; font-size: 14px; color: black;">Note finale</div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: black;">Taux de réussite</td>
                <td style="padding: 5px 0; text-align: right; font-weight: bold; color: black;">${metrics.successRate}%</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: black;">Temps total</td>
                <td style="padding: 5px 0; text-align: right; font-weight: bold; color: black;">${Math.floor(metrics.durationInSeconds / 60)}m ${metrics.durationInSeconds % 60}s</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: black;">Points obtenus</td>
                <td style="padding: 5px 0; text-align: right; font-weight: bold; color: black;">${result.totalPoints}/${result.maxPoints}</td>
              </tr>
            </table>
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
              <div style="margin-left: 15px; margin-bottom: 5px;">
                <div style="font-weight: bold; margin-bottom: 5px; color: black;">Réponses :</div>
                <div style="border: 1px solid #eee; padding: 8px; color: black;">${answer.answerText || "Sans réponse"}</div>
              </div>
            `;
          } else {
            const answerIds = answer.answerIds || (answer.answerId ? [answer.answerId] : []);
            
            answerContent = `
              <div style="margin-left: 15px; margin-bottom: 5px;">
                <div style="font-weight: bold; margin-bottom: 5px; color: black;">Réponses :</div>
                ${question.answers.map(option => {
                  const isSelected = answerIds.includes(option.id);
                  const isCorrect = option.isCorrect;
                  const iconColor = isSelected && isCorrect ? '#10b981' : (isSelected && !isCorrect ? '#e53e3e' : 'black');
                  const textColor = isSelected ? iconColor : 'black';
                  const icon = isSelected ? '●' : '○';
                  
                  return `
                    <div style="margin-bottom: 3px; color: ${textColor};">
                      <span style="display: inline-block; width: 15px; text-align: center; color: ${iconColor};">${icon}</span>
                      <span>${option.text}</span>
                      ${isSelected && isCorrect ? '<span style="display: inline-block; margin-left: 5px;">✓</span>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }
          
          // Déterminer la couleur de l'icône selon si la réponse est correcte
          const hasCorrectAnswer = answer.points === question.points;
          const iconColor = hasCorrectAnswer ? '#10b981' : '#e53e3e';
          
          return `
            <div style="border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div style="font-weight: bold; color: black; flex: 1;">Question ${index + 1}: ${question.text}</div>
                <div style="display: flex; align-items: center; color: black;">
                  <span style="margin-right: 5px; color: ${iconColor};">${hasCorrectAnswer ? `<span style="color: #10b981; font-size: 16px;">✓</span>` : ''}</span>
                  <span>${answer.points}/${question.points}</span>
                </div>
              </div>
              ${answerContent}
            </div>
          `;
        }).join('')}
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
          toast.success("PDF téléchargé avec succès");
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
