
import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import PageHeader from '@/components/quiz-listing/PageHeader';
import EmptyState from '@/components/quiz-listing/EmptyState';
import QuizGrid from '@/components/quiz-listing/QuizGrid';

const Index = () => {
  const { quizzes } = useQuiz();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {filteredQuizzes.length === 0 ? (
        <EmptyState searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      ) : (
        <QuizGrid quizzes={filteredQuizzes} />
      )}
    </div>
  );
};

export default Index;
