import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, Question as QuestionType, QuizResult, Participant } from '@/context/QuizContext';
import Question from '@/components/ui-components/Question';
import Signature from '@/components/ui-components/Signature';
import { toast } from "sonner";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const { getQuiz, addResult } = useQuiz();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Participant info
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructor, setInstructor] = useState('');
  const [signature, setSignature] = useState('');
  
  // Answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string, string>>({});
  
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (id) {
      const quizData = getQuiz(id);
      if (quizData) {
        setQuiz(quizData);
        setStartTime(new Date());
      } else {
        toast.error("Quiz introuvable");
        navigate('/');
      }
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [id, getQuiz, navigate]);
  
  useEffect(() => {
    if (startTime) {
      timerRef.current = window.setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [startTime]);
  
  const handleAnswerSelect = (questionId: string, answerId: string, selected: boolean) => {
    setSelectedAnswers(prev => {
      const current = prev[questionId] || [];
      
      // Trouve la question
      const question = quiz.questions.find((q: QuestionType) => q.id === questionId);
      if (question) {
        if (question.type === 'multiple-choice') {
          // Pour les choix multiples, une seule réponse est autorisée
          return {
            ...prev,
            [questionId]: selected ? [answerId] : []
          };
        } else if (question.type === 'checkbox') {
          // Pour les cases à cocher, plusieurs réponses sont autorisées
          if (selected) {
            return {
              ...prev,
              [questionId]: [...current, answerId]
            };
          } else {
            return {
              ...prev,
              [questionId]: current.filter(id => id !== answerId)
            };
          }
        }
      }
      
      return prev;
    });
  };
  
  const handleOpenEndedAnswerChange = (questionId: string, answer: string) => {
    setOpenEndedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const handleNextStep = () => {
    if (currentStep === 0) {
      // Validate participant info
      if (!name.trim()) {
        toast.error("Veuillez saisir votre nom");
        return;
      }
      if (!instructor.trim()) {
        toast.error("Veuillez saisir le nom du formateur");
        return;
      }
      if (!signature) {
        toast.error("Veuillez signer");
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(2, prev + 1));
  };
  
  const calculateResults = (): QuizResult => {
    const answers = quiz.questions.map((question: QuestionType) => {
      if (question.type === 'multiple-choice') {
        const userAnswers = selectedAnswers[question.id] || [];
        const correctAnswer = question.answers.find(a => a.isCorrect);
        const isCorrect = correctAnswer && userAnswers.includes(correctAnswer.id);
        
        return {
          questionId: question.id,
          answerId: userAnswers[0] || undefined,
          isCorrect: !!isCorrect,
          points: isCorrect ? (correctAnswer.points || 1) : 0,
        };
      } else if (question.type === 'checkbox') {
        const userAnswers = selectedAnswers[question.id] || [];
        
        // Calculer les points pour les cases à cocher
        let totalPoints = 0;
        let isAllCorrect = true;
        
        // Points pour les réponses correctes sélectionnées
        question.answers.forEach(answer => {
          const isSelected = userAnswers.includes(answer.id);
          
          if (answer.isCorrect && isSelected) {
            // Réponse correcte et sélectionnée
            totalPoints += (answer.points || 1);
          } else if (answer.isCorrect && !isSelected) {
            // Réponse correcte mais non sélectionnée
            isAllCorrect = false;
          } else if (!answer.isCorrect && isSelected) {
            // Réponse incorrecte mais sélectionnée
            isAllCorrect = false;
          }
        });
        
        return {
          questionId: question.id,
          answerIds: userAnswers,
          isCorrect: isAllCorrect && userAnswers.length > 0,
          points: totalPoints,
        };
      } else {
        // Open-ended questions are manually evaluated
        const userAnswer = openEndedAnswers[question.id] || '';
        return {
          questionId: question.id,
          answerText: userAnswer,
          isCorrect: false, // We can't automatically determine this
          points: 0, // Start with 0, can be manually adjusted later
        };
      }
    });
    
    const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);
    
    // Calculate maximum possible points (sum of all correct answer points)
    const maxPoints = quiz.questions.reduce((sum: number, q: QuestionType) => {
      if (q.type === 'open-ended') {
        return sum + q.points;
      } else {
        // Pour les questions à choix, la somme des points des réponses correctes
        return sum + q.answers
          .filter(a => a.isCorrect)
          .reduce((answerSum, a) => answerSum + (a.points || 1), 0);
      }
    }, 0);
    
    const participantInfo: Participant = {
      name,
      date,
      instructor,
      signature,
    };
    
    return {
      id: '', // Will be assigned by addResult
      quizId: quiz.id,
      quizTitle: quiz.title,
      participant: participantInfo,
      answers,
      totalPoints,
      maxPoints,
      startTime: startTime || new Date(),
      endTime: new Date(),
    };
  };
  
  const handleSubmit = () => {
    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter((q: QuestionType) => {
      if (q.type === 'multiple-choice' || q.type === 'checkbox') {
        return !selectedAnswers[q.id] || selectedAnswers[q.id].length === 0;
      } else {
        return !openEndedAnswers[q.id] || openEndedAnswers[q.id].trim() === '';
      }
    });
    
    if (unansweredQuestions.length > 0) {
      const isConfirmed = window.confirm(`Il y a ${unansweredQuestions.length} question(s) sans réponse. Voulez-vous continuer quand même?`);
      if (!isConfirmed) {
        return;
      }
    }
    
    const results = calculateResults();
    addResult(results);
    
    // Clear the timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    navigate(`/quiz-results/${results.id}`);
  };
  
  if (!quiz) {
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
  
  const renderParticipantForm = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Vos informations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du participant *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du formateur *
          </label>
          <input
            type="text"
            id="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Signature *
          </label>
          <Signature onChange={setSignature} value={signature} />
        </div>
      </div>
    </div>
  );
  
  const renderQuizQuestions = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Questions</h2>
      
      <div className="bg-brand-lightgray py-2 px-4 rounded-lg flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-gray-700">
          <Clock size={16} className="text-brand-red" />
          <span>Temps écoulé: {formatTime(elapsedTime)}</span>
        </div>
        <div className="text-sm">
          {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="space-y-8">
        {quiz.questions.map((question: QuestionType, index: number) => (
          <div key={question.id}>
            <div className="text-sm text-gray-500 mb-1">Question {index + 1}/{quiz.questions.length}</div>
            <Question
              question={question}
              onChange={() => {}}
              onDelete={() => {}}
              isEditable={false}
              selectedAnswers={selectedAnswers[question.id] || []}
              onAnswerSelect={(answerId, selected) => 
                handleAnswerSelect(question.id, answerId, selected)
              }
              openEndedAnswer={openEndedAnswers[question.id] || ''}
              onOpenEndedAnswerChange={(answer) => 
                handleOpenEndedAnswerChange(question.id, answer)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderQuizReview = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Vérification avant soumission</h2>
      
      <div className="bg-brand-lightgray p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Participant</div>
            <div className="font-medium">{name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Date</div>
            <div className="font-medium">{date}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Formateur</div>
            <div className="font-medium">{instructor}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Temps écoulé</div>
            <div className="font-medium">{formatTime(elapsedTime)}</div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-sm text-gray-500">Signature</div>
          <div className="border rounded-lg overflow-hidden mt-1 w-48 h-16 bg-white">
            {signature && <img src={signature} alt="Signature" className="w-full h-full object-contain" />}
          </div>
        </div>
      </div>
      
      <div>
        <div className="text-sm text-gray-500 mb-2">Questions répondues: {
          quiz.questions.filter((q: QuestionType) => {
            if (q.type === 'multiple-choice' || q.type === 'checkbox') {
              return selectedAnswers[q.id] && selectedAnswers[q.id].length > 0;
            } else {
              return openEndedAnswers[q.id] && openEndedAnswers[q.id].trim() !== '';
            }
          }).length
        } / {quiz.questions.length}</div>
        
        {quiz.questions.some((q: QuestionType) => {
          if (q.type === 'multiple-choice' || q.type === 'checkbox') {
            return !selectedAnswers[q.id] || selectedAnswers[q.id].length === 0;
          } else {
            return !openEndedAnswers[q.id] || openEndedAnswers[q.id].trim() === '';
          }
        }) && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            Attention : Certaines questions n'ont pas de réponse. Vous pouvez toujours soumettre le quiz, mais votre score sera impacté.
          </div>
        )}
      </div>
      
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-brand-red text-white px-6 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 mx-auto transition-all hover:bg-opacity-90 button-hover"
        >
          <CheckCircle size={20} />
          <span>Valider vos réponses</span>
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Retour à l'accueil</span>
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <div>{quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}</div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 my-6"></div>
        
        {/* Step content */}
        <div>
          {currentStep === 0 && renderParticipantForm()}
          {currentStep === 1 && renderQuizQuestions()}
          {currentStep === 2 && renderQuizReview()}
        </div>
        
        <div className="border-t border-gray-100 my-6"></div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep > 0
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={18} />
            <span>Précédent</span>
          </button>
          
          {currentStep < 2 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors"
            >
              <span>Suivant</span>
              <ChevronRight size={18} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
