import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '@/context/QuizContext';
import { toast } from 'sonner';
import { Save, Printer, Download } from 'lucide-react';
import QuizTitleSection from './QuizTitleSection';
import QuestionsSection from './QuestionsSection';
import { Button } from '@/components/ui/button';
import QuizPdfTemplate from './QuizPdfTemplate';
import html2pdf from 'html2pdf.js';
type QuizFormProps = {
  title: string;
  setTitle: (title: string) => void;
  imageUrl: string;
  setImageUrl: (imageUrl: string) => void;
  questions: Quiz['questions'];
  setQuestions: (questions: Quiz['questions']) => void;
  isEditing: boolean;
  handleSaveQuiz: () => void;
};
const QuizForm: React.FC<QuizFormProps> = ({
  title,
  setTitle,
  imageUrl,
  setImageUrl,
  questions,
  setQuestions,
  isEditing,
  handleSaveQuiz
}) => {
  const navigate = useNavigate();
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const handleAddQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: '',
      type: 'multiple-choice' as const,
      points: 1,
      answers: []
    };
    setQuestions([...questions, newQuestion]);
  };
  const handleUpdateQuestion = (index: number, updatedQuestion: Quiz['questions'][0]) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };
  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  const handlePrintQuiz = async () => {
    try {
      setGeneratingPdf(true);
      document.body.classList.add('generating-pdf');
      if (pdfTemplateRef.current) {
        const pdfOptions = {
          margin: 10,
          filename: `${title.replace(/\s+/g, '-').toLowerCase() || 'quiz'}.pdf`,
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
        setTimeout(async () => {
          await html2pdf().from(pdfTemplateRef.current).set(pdfOptions).outputPdf('dataurlnewwindow');
          setGeneratingPdf(false);
          document.body.classList.remove('generating-pdf');
          toast.success("Impression du quiz en cours");
        }, 500);
      }
    } catch (error) {
      setGeneratingPdf(false);
      document.body.classList.remove('generating-pdf');
      toast.error("Erreur lors de l'impression du quiz");
      console.error("Print error:", error);
    }
  };
  const handleDownloadQuiz = async () => {
    try {
      setGeneratingPdf(true);
      document.body.classList.add('generating-pdf');
      if (pdfTemplateRef.current) {
        const pdfOptions = {
          margin: 10,
          filename: `${title.replace(/\s+/g, '-').toLowerCase() || 'quiz'}.pdf`,
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
        setTimeout(async () => {
          await html2pdf().from(pdfTemplateRef.current).set(pdfOptions).save();
          setGeneratingPdf(false);
          document.body.classList.remove('generating-pdf');
          toast.success("Quiz téléchargé avec succès");
        }, 500);
      }
    } catch (error) {
      setGeneratingPdf(false);
      document.body.classList.remove('generating-pdf');
      toast.error("Erreur lors du téléchargement du quiz");
      console.error("Download error:", error);
    }
  };
  return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Modifier le quiz' : 'Créer un nouveau quiz'}
      </h1>
      
      <QuizTitleSection title={title} setTitle={setTitle} imageUrl={imageUrl} setImageUrl={setImageUrl} />
      
      <QuestionsSection questions={questions} onAddQuestion={handleAddQuestion} onUpdateQuestion={handleUpdateQuestion} onDeleteQuestion={handleDeleteQuestion} setQuestions={setQuestions} />
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handlePrintQuiz} className="flex items-center justify-center gap-2 hover:bg-gray-100" disabled={generatingPdf}>
          <Printer size={18} />
          <span>Imprimer une version vierge</span>
        </Button>
        
        <Button variant="outline" onClick={handleDownloadQuiz} className="flex items-center justify-center gap-2 hover:bg-gray-100" disabled={generatingPdf}>
          <Download size={18} />
          <span>Enregistrer une version vierge</span>
        </Button>
        
        <button onClick={handleSaveQuiz} className="bg-brand-red text-white px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-opacity-90 button-hover">
          <Save size={18} />
          <span>{isEditing ? 'Mettre à jour le quiz' : 'Enregistrer le quiz'}</span>
        </button>
      </div>
      
      <div className="hidden">
        <QuizPdfTemplate ref={pdfTemplateRef} title={title} imageUrl={imageUrl} questions={questions} />
      </div>
    </div>;
};
export default QuizForm;