
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, QuizResult, Question } from '@/context/QuizContext';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';
import html2pdf from 'html2pdf.js';

// Imported components
import ParticipantInfo from '@/components/quiz-results/ParticipantInfo';
import ScoreSummary from '@/components/quiz-results/ScoreSummary';
import AnswerDetail from '@/components/quiz-results/AnswerDetail';
import PdfControls from '@/components/quiz-results/PdfControls';
import { calculateTotalPointsForQuestion } from '@/components/quiz-results/utils';
import { QuizResultAnswer } from '@/components/quiz-results/types';

const QuizResults = () => {
  const { id } = useParams<{ id: string }>();
  const { getResult, getQuiz } = useQuiz();
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, Question>>({});
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const resultData = getResult(id);
      if (resultData) {
        setResult(resultData);

        // Get quiz questions for reference
        const quiz = getQuiz(resultData.quizId);
        if (quiz) {
          const questionsMap: Record<string, Question> = {};
          quiz.questions.forEach(q => {
            questionsMap[q.id] = q;
          });
          setQuizQuestions(questionsMap);
        }
      } else {
        toast.error("Résultat introuvable");
        navigate('/results');
      }
    }
  }, [id, getResult, getQuiz, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;
    const options = {
      margin: 10,
      filename: `quiz-result-${result?.quizTitle.replace(/\s+/g, '-').toLowerCase() || 'result'}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    // Add a temporary class for PDF generation
    document.body.classList.add('generating-pdf');
    element.classList.add('generating-pdf');
    
    toast.promise(html2pdf().set(options).from(element).save().then(() => {
      document.body.classList.remove('generating-pdf');
      element.classList.remove('generating-pdf');
    }), {
      loading: 'Génération du PDF en cours...',
      success: 'PDF téléchargé avec succès',
      error: 'Erreur lors de la génération du PDF'
    });
  };

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md mb-6 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Calculate score on 20 (rounded to integer)
  const scoreOn20 = result.totalPoints / result.maxPoints * 20;

  // Calculate success rate (rounded to integer)
  const successRate = result.totalPoints / result.maxPoints * 100;

  // Calculate duration
  const durationInSeconds = Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000);

  // Convert the answers format to match what AnswerDetail expects
  const formattedAnswers: QuizResultAnswer[] = result.answers.map(answer => {
    // Create the givenAnswers array based on the available data
    let givenAnswers: string[] = [];
    
    if (answer.answerText) {
      // For open-ended questions
      givenAnswers = [answer.answerText];
    } else if (answer.answerIds && answer.answerIds.length > 0) {
      // For checkbox questions
      givenAnswers = answer.answerIds;
    } else if (answer.answerId) {
      // For multiple-choice questions
      givenAnswers = [answer.answerId];
    }
    
    return {
      ...answer,
      givenAnswers
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate('/results')} 
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors print:hidden"
      >
        <ArrowLeft size={18} />
        <span>Retour aux résultats</span>
      </button>
      
      <div ref={pdfRef} id="quiz-pdf-content" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-6 print:mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Résultats du quiz</h1>
            <h2 className="text-xl">{result.quizTitle}</h2>
          </div>
          
          <PdfControls 
            onPrint={handlePrint} 
            onDownloadPDF={handleDownloadPDF} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 page-break-inside-avoid">
          <ParticipantInfo participant={result.participant} />
          
          <ScoreSummary
            scoreOn20={scoreOn20}
            successRate={successRate}
            durationInSeconds={durationInSeconds}
            totalPoints={result.totalPoints}
            maxPoints={result.maxPoints}
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Détail des réponses</h3>
          
          <div className="space-y-6">
            {formattedAnswers.map((answer, index) => {
              const question = quizQuestions[answer.questionId];
              if (!question) return null;

              // Calculate the total possible points for this question
              const totalQuestionPoints = calculateTotalPointsForQuestion(question);
              
              return (
                <AnswerDetail 
                  key={answer.questionId}
                  answer={answer}
                  question={question}
                  index={index}
                  totalQuestionPoints={totalQuestionPoints}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
