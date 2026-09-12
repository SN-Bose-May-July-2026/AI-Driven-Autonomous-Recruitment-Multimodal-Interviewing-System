import { useState, useEffect } from 'react'
import UploadDashboard from './components/UploadDashboard'
import InterviewRoom from './components/InterviewRoom'
import CandidateDashboard from './components/CandidateDashboard'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [view, setView] = useState<'home' | 'dashboard' | 'interview'>('home')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-10 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Navigation Bar */}
      <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div 
          className="font-bold text-xl tracking-tight cursor-pointer"
          onClick={() => setView('home')}
        >
          AI Orchestrator
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setView('dashboard')} className={`font-medium text-sm ${view === 'dashboard' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>
            HR Dashboard
          </button>
          <button onClick={() => setView('candidate')} className={`font-medium text-sm ${view === 'candidate' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>
            Candidate Dashboard
          </button>
          <button onClick={() => setView('interview')} className={`font-medium text-sm ${view === 'interview' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>
            Interview Room
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 ml-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 p-4 max-w-7xl mx-auto mt-6">
        {view === 'home' && (
          <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 mt-10 flex flex-col items-center text-center space-y-6 shadow-sm">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              The Future of Technical Hiring
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
              Automate resume parsing with LLMs, semantically shortlist the best candidates, and conduct autonomous, multimodal technical interviews in real-time.
            </p>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setView('dashboard')}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Go to HR Dashboard
              </button>
              <button 
                onClick={() => setView('interview')}
                className="px-6 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Simulate Interview
              </button>
            </div>
          </div>
        )}

        {view === 'dashboard' && <UploadDashboard />}
        {view === 'candidate' && <CandidateDashboard />}
        {view === 'interview' && <InterviewRoom />}
      </main>

    </div>
  )
}

export default App
