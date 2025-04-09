
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

  // Fonction corrigée pour télécharger le PDF
  const handleDownloadPDF = async () => {
    if (!result || !quizQuestions || !metrics) return;
    
    try {
      setIsGenerating(true);
      toast.info("Préparation du PDF...", { duration: 3000 });
      
      // Créer temporairement un élément caché pour le rendu du PDF
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'fixed'; // Fixed au lieu de absolute pour être bien rendu
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.width = '210mm'; // A4 width
      pdfContainer.style.backgroundColor = 'white';
      document.body.appendChild(pdfContainer);
      
      // Render the PDF template to the hidden container
      const root = document.createElement('div');
      root.id = 'pdf-root';
      root.className = 'pdf-root';
      pdfContainer.appendChild(root);
      
      // Insert the PDF template directly into the DOM
      root.innerHTML = `
        <div class="pdf-container" style="
          width: 210mm;
          padding: 10mm;
          background-color: white;
          color: black;
          font-family: Arial, sans-serif;
        ">
          <div id="pdf-content">
            <!-- PDF content will be inserted here -->
          </div>
        </div>
      `;
      
      // Append styles for PDF rendering
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .pdf-container * {
          color: black !important;
          background-color: white !important;
          font-family: Arial, sans-serif !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .pdf-container img {
          max-width: 100%;
          height: auto;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Get the PDF content element
      const pdfContentElement = pdfContainer.querySelector('#pdf-content');
      if (!pdfContentElement) {
        throw new Error('PDF content element not found');
      }
      
      // Create the PDF content manually (more reliable than React rendering)
      pdfContentElement.innerHTML = `
        <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 4px;">Résultats du quiz</h1>
        <h2 style="font-size: 16px; margin-bottom: 10px;">${result.quizTitle}</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="flex: 1; border: 1px solid #eee; padding: 10px; margin-right: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">Informations du participant</h3>
            <div>Nom: ${result.participant.name}</div>
            <div>Date: ${result.participant.date}</div>
            <div>Formateur: ${result.participant.instructor}</div>
            ${result.participant.signature ? 
              `<div style="margin-top: 10px;">
                <div>Signature:</div>
                <img 
                  src="${result.participant.signature}" 
                  style="max-width: 150px; max-height: 60px;"
                  crossorigin="anonymous"
                  onload="this.dataset.loaded='true'"
                />
              </div>` : ''}
          </div>
          
          <div style="flex: 1; border: 1px solid #eee; padding: 10px; margin-left: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">Résumé des résultats</h3>
            <div>Note: ${metrics.scoreOn20.toFixed(1)}/20</div>
            <div>Taux de réussite: ${metrics.successRate}%</div>
            <div>Temps total: ${Math.floor(metrics.durationInSeconds / 60)}min ${metrics.durationInSeconds % 60}s</div>
            <div>Points: ${result.totalPoints}/${result.maxPoints}</div>
          </div>
        </div>
        
        <div style="margin-top: 15px;">
          <h3 style="font-weight: bold; margin-bottom: 10px;">Détail des réponses</h3>
          <div>
            ${result.answers.map((answer, index) => {
              const question = quizQuestions[answer.questionId];
              if (!question) return '';
              
              let answerContent = '';
              
              if (question.type === 'open-ended') {
                answerContent = `
                  <div style="padding-left: 15px; margin-bottom: 5px;">
                    <div style="font-weight: bold;">Réponse:</div>
                    <div style="border: 1px solid #eee; padding: 5px;">${answer.answerText || "Sans réponse"}</div>
                  </div>
                `;
              } else {
                const answerIds = answer.answerIds || (answer.answerId ? [answer.answerId] : []);
                
                answerContent = `
                  <div style="padding-left: 15px; margin-bottom: 5px;">
                    <div style="font-weight: bold;">Réponses:</div>
                    ${question.answers.map(option => {
                      const isSelected = answerIds.includes(option.id);
                      const color = isSelected 
                        ? (option.isCorrect ? 'green' : 'red')
                        : 'black';
                      
                      return `
                        <div style="color: ${color} !important; margin-bottom: 2px;">
                          ${isSelected ? '✓' : '○'} ${option.text}
                        </div>
                      `;
                    }).join('')}
                  </div>
                `;
              }
              
              return `
                <div style="border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 5px;">
                  <div style="display: flex; justify-content: space-between;">
                    <div style="font-weight: bold;">Q${index + 1}: ${question.text}</div>
                    <div>${answer.points}/${question.points || 1}</div>
                  </div>
                  ${question.imageUrl ? 
                    `<div style="margin: 5px 0;">
                      <img 
                        src="${question.imageUrl}" 
                        style="max-height: 100px; max-width: 100%;"
                        crossorigin="anonymous" 
                        onload="this.dataset.loaded='true'"
                      />
                    </div>` : ''}
                  ${answerContent}
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666 !important; border-top: 1px solid #eee; padding-top: 10px;">
          Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}
        </div>
      `;
      
      // Attendre que toutes les images soient chargées
      const checkImagesLoaded = () => {
        return new Promise<void>((resolve) => {
          // Voir si toutes les images ont l'attribut 'loaded'
          const images = pdfContainer.querySelectorAll('img');
          let allLoaded = true;
          
          images.forEach(img => {
            // Si l'image n'a pas l'attribut loaded, on attend
            if (!img.dataset.loaded) {
              allLoaded = false;
            }
          });
          
          if (allLoaded || images.length === 0) {
            resolve();
          } else {
            // Réessayer après un court délai
            setTimeout(() => checkImagesLoaded().then(resolve), 300);
          }
        });
      };
      
      // Attendre explicitement que les images soient chargées
      await checkImagesLoaded();
      // Attente supplémentaire pour s'assurer que le rendu est complet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate the PDF
      const filename = `Quiz_${result.quizTitle.replace(/[^a-z0-9]/gi, '_')}_${result.participant.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      
      // Convert to PDF blob with extended timeout
      console.log("Démarrage de la conversion HTML -> PDF");
      const pdfBlob = await convertElementToPdfBlob(pdfContainer, filename);
      console.log("Conversion PDF terminée, taille du blob:", pdfBlob.size);
      
      // Download the PDF blob with save dialog
      console.log("Déclenchement du téléchargement");
      downloadPdfBlob(pdfBlob, filename);
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(pdfContainer);
        document.head.removeChild(styleElement);
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
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
