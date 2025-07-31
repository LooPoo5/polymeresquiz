
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { QuizProvider } from '@/context/QuizContext'
import Header from '@/components/layout/Header'
import Index from '@/pages/Index'
import CreateQuiz from '@/pages/CreateQuiz'
import TakeQuiz from '@/pages/TakeQuiz'
import AllResults from '@/pages/AllResults'
import QuizResults from '@/pages/QuizResults'
import ParticipantStats from '@/pages/ParticipantStats'
import DataPage from '@/pages/DataPage'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuizProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateQuiz />} />
              <Route path="/edit/:id" element={<CreateQuiz />} />
              <Route path="/quiz/:id" element={<TakeQuiz />} />
              <Route path="/results" element={<AllResults />} />
              <Route path="/results/:id" element={<QuizResults />} />
              <Route path="/participant-stats/:name" element={<ParticipantStats />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </QuizProvider>
    </QueryClientProvider>
  )
}

export default App
