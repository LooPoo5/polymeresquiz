import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";

// Custom hook and components
import { useQuizResult } from '@/hooks/useQuizResult';
import ParticipantInfo from '@/components/quiz-results/ParticipantInfo';
import ScoreSummary from '@/components/quiz-results/ScoreSummary';
import PdfControls from '@/components/quiz-results/PdfControls';
import ResultsLoadingState from '@/components/quiz-results/ResultsLoadingState';
import QuizAnswerList from '@/components/quiz-results/QuizAnswerList';
import { convertElementToPdfBlob, downloadPdfBlob } from '@/utils/pdf/pdfConverter';

const QuizResults = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { result, quizQuestions, metrics } = useQuizResult(id);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fonction pour imprimer la page actuelle
  const handlePrint = () => {
    if (!result) return;
    
    // Set the document title for the print dialog
    const originalTitle = document.title;
    document.title = `${result.participant.name} ${result.participant.date} ${result.quizTitle}`;
    
    // Print the document
    window.print();
    
    // Restore the original title
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  // Fonction améliorée pour télécharger le PDF
  const handleDownloadPDF = async () => {
    if (!result || !quizQuestions || !metrics) return;
    
    try {
      setIsGenerating(true);
      toast.info("Préparation du PDF...", { duration: 3000 });
      
      // 1. Format du nom de fichier avec le nom du participant, date et titre du quiz
      const filename = `${result.participant.name} ${result.participant.date} ${result.quizTitle}.pdf`;
      
      // 2. Créer un élément de conteneur PDF en dehors du DOM visible
      const pdfContainer = document.createElement('div');
      pdfContainer.id = 'pdf-container';
      pdfContainer.style.position = 'fixed';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '210mm'; // Largeur A4
      pdfContainer.style.height = 'auto';
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.padding = '20mm';
      pdfContainer.style.overflow = 'hidden';
      document.body.appendChild(pdfContainer);
      
      // 3. Ajouter les styles PDF directement dans le DOM
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        #pdf-container {
          font-family: Arial, sans-serif !important;
          color: black !important;
          background-color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #pdf-container * {
          color: black !important;
          font-family: Arial, sans-serif !important;
        }
        #pdf-container img {
          max-width: 100%;
          height: auto;
        }
      `;
      document.head.appendChild(styleElement);
      
      // 4. Construire directement le HTML pour le PDF
      pdfContainer.innerHTML = `
        <div class="pdf-content">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Résultats du quiz</h1>
          <h2 style="font-size: 18px; margin-bottom: 16px;">${result.quizTitle}</h2>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="flex: 1; border: 1px solid #eee; padding: 15px; margin-right: 10px;">
              <h3 style="font-weight: bold; margin-bottom: 10px;">Informations du participant</h3>
              <div style="margin-bottom: 5px;"><span style="font-weight: bold;">Nom:</span> ${result.participant.name}</div>
              <div style="margin-bottom: 5px;"><span style="font-weight: bold;">Date:</span> ${result.participant.date}</div>
              <div style="margin-bottom: 5px;"><span style="font-weight: bold;">Formateur:</span> ${result.participant.instructor}</div>
              ${result.participant.signature ? 
                `<div style="margin-top: 10px;">
                  <div style="margin-bottom: 5px;">Signature:</div>
                  <img 
                    src="${result.participant.signature}" 
                    alt="Signature" 
                    style="max-width: 150px; max-height: 60px; border: 1px solid #eee;"
                    crossorigin="anonymous"
                  />
                </div>` : ''}
            </div>
            
            <div style="flex: 1; border: 1px solid #eee; padding: 15px; margin-left: 10px;">
              <h3 style="font-weight: bold; margin-bottom: 10px;">Résumé des résultats</h3>
              <div style="margin-bottom: 5px;"><span style="font-weight: bold;">Note:</span> ${metrics.scoreOn20.toFixed(1)}/20</div>
              <div style="margin-bottom: 5px;"><span style="font-weight: bold;">Taux de réussite:</span> ${metrics.successRate}%</div>
              <div style="margin-bottom: 5px;"><span style="font-weight: bold;">Temps total:</span> ${Math.floor(metrics.durationInSeconds / 60)}min ${metrics.durationInSeconds % 60}s</div>
              <div style="margin-bottom: 5px;"><span style="font-weight: bold;">Points:</span> ${result.totalPoints}/${result.maxPoints}</div>
            </div>
          </div>
          
          <h3 style="font-weight: bold; margin-bottom: 10px;">Détail des réponses</h3>
          ${result.answers.map((answer, index) => {
            const question = quizQuestions[answer.questionId];
            if (!question) return '';
            
            // Déterminer le type de question et formater les réponses en conséquence
            let answerContent = '';
            
            if (question.type === 'open-ended') {
              answerContent = `
                <div style="margin-left: 15px; margin-bottom: 10px;">
                  <div style="font-weight: bold; margin-bottom: 5px;">Réponse:</div>
                  <div style="border: 1px solid #eee; padding: 8px;">${answer.answerText || "Sans réponse"}</div>
                </div>
              `;
            } else {
              const answerIds = answer.answerIds || (answer.answerId ? [answer.answerId] : []);
              
              answerContent = `
                <div style="margin-left: 15px; margin-bottom: 10px;">
                  <div style="font-weight: bold; margin-bottom: 5px;">Réponses:</div>
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
                  <div style="font-weight: bold;">Q${index + 1}: ${question.text}</div>
                  <div>${answer.points}/${question.points || 1}</div>
                </div>
                ${question.imageUrl ? 
                  `<div style="margin-bottom: 10px;">
                    <img 
                      src="${question.imageUrl}" 
                      alt="Question ${index + 1}" 
                      style="max-height: 120px; max-width: 100%;"
                      crossorigin="anonymous"
                    />
                  </div>` : ''}
                ${answerContent}
              </div>
            `;
          }).join('')}
          
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666 !important; border-top: 1px solid #eee; padding-top: 10px;">
            Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}
          </div>
        </div>
      `;
      
      // 5. Attendre explicitement un délai pour que le DOM soit bien rendu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 6. Générer le PDF à partir du conteneur
      console.log("Génération du PDF à partir du conteneur");
      const pdfBlob = await convertElementToPdfBlob(pdfContainer, filename);
      
      // 7. Déclencher le téléchargement avec la boîte de dialogue
      downloadPdfBlob(pdfBlob, filename);
      
      // 8. Nettoyer les éléments temporaires
      setTimeout(() => {
        document.body.removeChild(pdfContainer);
        document.head.removeChild(styleElement);
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
      setIsGenerating(false);
    }
  };

  if (!result || !metrics) {
    return <ResultsLoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate('/results')} 
          className="flex items-center gap-2 text-gray-600 hover:text-brand-red transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Retour aux résultats</span>
        </button>
      </div>
      
      <div id="quiz-pdf-content" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Résultats du quiz</h1>
            <p className="text-gray-600">{result.quizTitle}</p>
          </div>
          
          <PdfControls 
            onPrint={handlePrint}
            onDownloadPDF={handleDownloadPDF}
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ParticipantInfo participant={result.participant} />
          
          <ScoreSummary
            scoreOn20={metrics.scoreOn20}
            successRate={metrics.successRate}
            durationInSeconds={metrics.durationInSeconds}
            totalPoints={result.totalPoints}
            maxPoints={result.maxPoints}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Détail des réponses</h2>
          <QuizAnswerList 
            answers={result.answers}
            questionsMap={quizQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
