
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import React from "react";

// Create React Query client outside the component
const queryClient = new QueryClient();

// Define App as a React.FC to ensure proper React integration
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <QuizProvider>
            <TooltipProvider>
              <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
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
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QuizProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
