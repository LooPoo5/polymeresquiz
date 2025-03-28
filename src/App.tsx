
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Header from "./components/layout/Header";
import Index from "./pages/Index";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResults from "./pages/QuizResults";
import AllResults from "./pages/AllResults";
import ParticipantStats from "./pages/ParticipantStats";
import DataPage from "./pages/DataPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Component to handle resetting dark mode when not on quiz pages
const DarkModeHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    const isQuizPage = location.pathname.includes('/quiz/');
    if (!isQuizPage) {
      // Reset to light mode when not on quiz pages
      document.documentElement.classList.remove('dark');
    } else {
      // Check saved preference for quiz pages
      const savedDarkMode = localStorage.getItem('quizDarkMode') === 'true';
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [location]);
  
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuizProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DarkModeHandler />
          <div className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-gray-900">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<CreateQuiz />} />
                <Route path="/edit/:id" element={<CreateQuiz />} />
                <Route path="/quiz/:id" element={<TakeQuiz />} />
                <Route path="/quiz-results/:id" element={<QuizResults />} />
                <Route path="/results" element={<AllResults />} />
                <Route path="/participant-stats/:participantName" element={<ParticipantStats />} />
                <Route path="/data" element={<DataPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </QuizProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
