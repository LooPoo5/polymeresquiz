
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, QuizResult, Question } from '@/context/QuizContext';
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, XCircle, DownloadCloud, Printer } from 'lucide-react';

const QuizResults = () => {
  const { id } = useParams<{ id: string; }>();
  const { getResult, getQuiz } = useQuiz();
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, Question>>({});

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
    toast("Cette fonctionnalité sera disponible prochainement.");
  };

  if (!result) {
    return <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md mb-6 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>;
  }

  // Calculate score on 20
  const scoreOn20 = Math.round(result.totalPoints / result.maxPoints * 20);

  // Calculate success rate
  const successRate = Math.round(result.totalPoints / result.maxPoints * 100);

  // Calculate duration
  const durationInSeconds = Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000);
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate('/results')} className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors print:hidden">
        <ArrowLeft size={18} />
        <span>Retour aux résultats</span>
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-6 print:mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Résultats du quiz</h1>
            <h2 className="text-xl">{result.quizTitle}</h2>
          </div>
          
          <div className="flex gap-3 print:hidden">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Printer size={18} />
              <span>Imprimer</span>
            </button>
            
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-opacity-90 transition-colors">
              <DownloadCloud size={18} />
              <span>Télécharger PDF</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-brand-lightgray rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-3">Informations du participant</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">{result.participant.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{result.participant.date}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Formateur:</span>
                <span className="font-medium">{result.participant.instructor}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-1">Signature:</div>
              <div className="border rounded-lg overflow-hidden w-48 h-20 bg-white">
                {result.participant.signature && <img src={result.participant.signature} alt="Signature" className="w-full h-full object-contain" />}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-brand-red mb-2 flex items-center">
                
                {scoreOn20}/20
              </div>
              <div className="text-gray-500 text-center">Note finale</div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{successRate}%</div>
              <div className="text-gray-500 text-center">Taux de réussite</div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                
                {formatDuration(durationInSeconds)}
              </div>
              <div className="text-gray-500 text-center">Temps total</div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {result.totalPoints}/{result.maxPoints}
              </div>
              <div className="text-gray-500 text-center">Points obtenus</div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Détail des réponses</h3>
          
          <div className="space-y-6">
            {result.answers.map((answer, index) => {
              const question = quizQuestions[answer.questionId];
              if (!question) return null;
              
              return (
                <div key={answer.questionId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">Question {index + 1}</div>
                      <div className="font-medium">{question.text}</div>
                    </div>
                    
                    <div className="flex items-center">
                      {answer.isCorrect ? 
                        <CheckCircle size={20} className="text-green-500 mr-1" /> : 
                        <XCircle size={20} className="text-red-500 mr-1" />
                      }
                      <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {answer.points} / {question.points} points
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">Votre réponse:</div>
                    
                    {question.type === 'multiple-choice' && (
                      <div>
                        {question.answers.map(option => {
                          const isSelected = option.id === answer.answerId;
                          if (!isSelected) return null;
                          
                          return (
                            <div key={option.id} className="flex justify-between items-center py-1">
                              <div>{option.text}</div>
                              <div className={option.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {option.isCorrect ? "Vrai" : "Faux"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {question.type === 'checkbox' && (
                      <div>
                        {question.answers.map(option => {
                          const isSelected = answer.answerIds?.includes(option.id);
                          if (!isSelected) return null;
                          
                          return (
                            <div key={option.id} className="flex justify-between items-center py-1">
                              <div>{option.text}</div>
                              <div className={option.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {option.isCorrect ? "Vrai" : "Faux"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {question.type === 'open-ended' && (
                      <div className="py-1">
                        <div>{answer.answerText || 'Pas de réponse'}</div>
                      </div>
                    )}
                  </div>
                  
                  {!answer.isCorrect && (
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-2">Bonne(s) réponse(s) attendue(s):</div>
                      
                      {question.type === 'multiple-choice' && (
                        <div>
                          {question.answers.filter(a => a.isCorrect).map(option => (
                            <div key={option.id} className="py-1 text-green-600">
                              {option.text}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'checkbox' && (
                        <div>
                          {question.answers.filter(a => a.isCorrect).map(option => (
                            <div key={option.id} className="py-1 text-green-600">
                              {option.text}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'open-ended' && (
                        <div className="py-1 text-green-600">
                          {question.correctAnswer || 'Pas de réponse correcte définie'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>;
};

export default QuizResults;
