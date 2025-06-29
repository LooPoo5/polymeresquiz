
import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz')
      const data = await response.json()
      setQuizzes(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Quiz App</h1>
          <p>Chargement...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Quiz App</h1>
        <p>Application de quiz déployée sur NAS Ugreen</p>
      </header>
      
      <main className="app-main">
        <section className="quiz-list">
          <h2>Quiz disponibles</h2>
          {quizzes.length === 0 ? (
            <p>Aucun quiz disponible pour le moment.</p>
          ) : (
            <div className="quiz-grid">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="quiz-card">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <button className="quiz-button">
                    Commencer le quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer className="app-footer">
        <p>© 2024 Quiz App - Déployé sur NAS Ugreen</p>
      </footer>
    </div>
  )
}

export default App
