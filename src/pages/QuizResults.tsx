
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';

// Imported components
import Celebration from '@/components/quiz-results/Celebration';
import ResultsHeader from '@/components/quiz-results/ResultsHeader';
import QuizResultContent from '@/components/quiz-results/QuizResultContent';
import { QuizResultAnswer } from '@/components/quiz-results/types';

// Celebration threshold (percentage)
const CELEBRATION_THRESHOLD = 85;

const QuizResults = () => {
  const { id } = useParams<{ id: string }>();
  const { getResult, getQuiz } = useQuiz();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, any>>({});
  const pdfRef = useRef<HTMLDivElement>(null);
  
  // Calculate successful answers stats
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  useEffect(() => {
    if (id) {
      const resultData = getResult(id);
      if (resultData) {
        setResult(resultData);

        // Get quiz questions for reference
        const quiz = getQuiz(resultData.quizId);
        if (quiz) {
          const questionsMap: Record<string, any> = {};
          quiz.questions.forEach((q: any) => {
            questionsMap[q.id] = q;
          });
          setQuizQuestions(questionsMap);
          
          // Calculate correct and incorrect answers
          let correct = 0;
          let incorrect = 0;
          
          resultData.answers.forEach((answer: any) => {
            if (answer.isCorrect) {
              correct++;
            } else {
              incorrect++;
            }
          });
          
          setCorrectAnswers(correct);
          setIncorrectAnswers(incorrect);
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
      filename: `rapport-quiz-${result?.quizTitle.replace(/\s+/g, '-').toLowerCase() || 'result'}.pdf`,
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
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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

  const scoreOn20 = Math.floor(result.totalPoints / result.maxPoints * 20);
  const successRate = Math.floor(result.totalPoints / result.maxPoints * 100);
  const durationInSeconds = Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000);

  const formattedAnswers: QuizResultAnswer[] = result.answers.map((answer: any) => {
    let givenAnswers: string[] = [];
    
    if (answer.answerText) {
      givenAnswers = [answer.answerText];
    } else if (answer.answerIds && answer.answerIds.length > 0) {
      givenAnswers = answer.answerIds;
    } else if (answer.answerId) {
      givenAnswers = [answer.answerId];
    }
    
    return {
      ...answer,
      givenAnswers
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Celebration 
        score={result.totalPoints}
        maxScore={result.maxPoints}
        threshold={CELEBRATION_THRESHOLD}
      />
      
      <ResultsHeader 
        quizTitle={result.quizTitle}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
      />
      
      <div ref={pdfRef} id="quiz-pdf-content">
        <QuizResultContent 
          quizTitle={result.quizTitle}
          participant={result.participant}
          scoreOn20={scoreOn20}
          successRate={successRate}
          durationInSeconds={durationInSeconds}
          totalPoints={result.totalPoints}
          maxPoints={result.maxPoints}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          formattedAnswers={formattedAnswers}
          questionsMap={quizQuestions}
        />
      </div>
    </div>
  );
};

export default QuizResults;
