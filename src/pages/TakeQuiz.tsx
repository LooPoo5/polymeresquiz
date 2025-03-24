
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz, Question as QuestionType, QuizResult, Participant } from '@/context/QuizContext';
import Question from '@/components/ui-components/Question';
import Signature from '@/components/ui-components/Signature';
import { toast } from "sonner";
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructor, setInstructor] = useState('');
  const [signature, setSignature] = useState('');

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string, string>>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      const quizData = getQuiz(id);
      if (quizData) {
        setQuiz(quizData);
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
    if (hasStartedQuiz && !startTime) {
      const now = new Date();
      setStartTime(now);
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [hasStartedQuiz, startTime]);

  const handleAnswerSelect = (questionId: string, answerId: string, selected: boolean) => {
    if (!hasStartedQuiz) {
      setHasStartedQuiz(true);
    }
    setSelectedAnswers(prev => {
      const current = prev[questionId] || [];

      const question = quiz.questions.find((q: QuestionType) => q.id === questionId);
      if (question) {
        if (question.type === 'multiple-choice') {
          return {
            ...prev,
            [questionId]: selected ? [answerId] : []
          };
        } else if (question.type === 'checkbox') {
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
    if (!hasStartedQuiz && answer.trim()) {
      setHasStartedQuiz(true);
    }
    setOpenEndedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Veuillez saisir votre nom");
      return false;
    }
    if (!instructor.trim()) {
      toast.error("Veuillez saisir le nom du formateur");
      return false;
    }
    if (!signature) {
      toast.error("Veuillez signer");
      return false;
    }
    return true;
  };

  const calculateResults = (): QuizResult => {
    const answers = quiz.questions.map((question: QuestionType) => {
      if (question.type === 'multiple-choice') {
        const userAnswers = selectedAnswers[question.id] || [];
        const selectedAnswerId = userAnswers[0];
        const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);
        const isCorrect = selectedAnswer?.isCorrect || false;
        
        return {
          questionId: question.id,
          answerId: userAnswers[0] || undefined,
          isCorrect: isCorrect,
          points: isCorrect ? (selectedAnswer?.points || 0) : 0
        };
      } else if (question.type === 'checkbox') {
        const userAnswers = selectedAnswers[question.id] || [];

        let totalPoints = 0;
        
        // Calculate points for checkbox questions by summing points from all correct selected answers
        question.answers.forEach(answer => {
          const isSelected = userAnswers.includes(answer.id);
          if (answer.isCorrect && isSelected) {
            totalPoints += answer.points || 0;
          }
        });

        // Determine if all answers are correct
        const isAllCorrect = question.answers.every(answer => {
          const isSelected = userAnswers.includes(answer.id);
          return (answer.isCorrect && isSelected) || (!answer.isCorrect && !isSelected);
        });

        return {
          questionId: question.id,
          answerIds: userAnswers,
          isCorrect: isAllCorrect,
          points: totalPoints
        };
      } else {
        const userAnswer = openEndedAnswers[question.id] || '';
        return {
          questionId: question.id,
          answerText: userAnswer,
          isCorrect: false, // For open-ended questions, no automatic grading
          points: 0 // Points will be assigned manually
        };
      }
    });

    const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);

    const maxPoints = quiz.questions.reduce((sum: number, q: QuestionType) => {
      if (q.type === 'open-ended') {
        return sum + q.points;
      } else {
        const correctAnswerPoints = q.answers
          .filter(a => a.isCorrect)
          .reduce((answerSum, a) => answerSum + (a.points || 0), 0);
        
        return sum + correctAnswerPoints;
      }
    }, 0);

    const participantInfo: Participant = {
      name,
      date,
      instructor,
      signature
    };

    return {
      id: '',
      quizId: quiz.id,
      quizTitle: quiz.title,
      participant: participantInfo,
      answers,
      totalPoints,
      maxPoints,
      startTime: startTime || new Date(),
      endTime: new Date()
    };
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

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
    const resultId = addResult(results);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    navigate(`/quiz-results/${resultId}`);
  };

  if (!quiz) {
    return <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md mb-6 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>;
  }

  return <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-brand-red mb-6 transition-colors">
        <ArrowLeft size={18} />
        <span>Retour à l'accueil</span>
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mx-0">
            <div>{quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}</div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 my-6"></div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Vos informations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du participant *
              </label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" required />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" required />
            </div>
            
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du formateur *
              </label>
              <input type="text" id="instructor" value={instructor} onChange={e => setInstructor(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" required />
            </div>
          </div>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          
          <div className="space-y-8">
            {quiz.questions.map((question: QuestionType, index: number) => (
              <div key={question.id}>
                <div className="text-sm text-gray-500 mb-1">Question {index + 1}/{quiz.questions.length}</div>
                <Question 
                  question={question} 
                  onChange={() => {}} 
                  onDelete={() => {}} 
                  selectedAnswers={selectedAnswers[question.id] || []} 
                  onAnswerSelect={(answerId, selected) => handleAnswerSelect(question.id, answerId, selected)} 
                  openEndedAnswer={openEndedAnswers[question.id] || ''} 
                  onOpenEndedAnswerChange={answer => handleOpenEndedAnswerChange(question.id, answer)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Signature *
          </label>
          <Signature onChange={setSignature} value={signature} width={300} height={150} />
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <div className="flex justify-between items-center">
            <div>
              {quiz.questions.some((q: QuestionType) => {
              if (q.type === 'multiple-choice' || q.type === 'checkbox') {
                return !selectedAnswers[q.id] || selectedAnswers[q.id].length === 0;
              } else {
                return !openEndedAnswers[q.id] || openEndedAnswers[q.id].trim() === '';
              }
            }) && <div className="text-sm text-amber-600">
                  Attention : Certaines questions n'ont pas de réponse.
                </div>}
            </div>
            <Button onClick={handleSubmit} className="bg-brand-red text-white px-6 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-opacity-90">
              <CheckCircle size={20} />
              <span>Valider vos réponses</span>
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

export default TakeQuiz;
