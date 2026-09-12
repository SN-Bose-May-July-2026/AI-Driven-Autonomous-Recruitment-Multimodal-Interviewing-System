import { useState } from 'react';

// Mock data representing what the Vector DB and PostgreSQL would return
const MOCK_CANDIDATES = [
  { id: 1, name: 'Diana Evans', email: 'diana@example.com', score: 98, status: 'Shortlisted', skills: ['React', 'Next.js', 'Tailwind CSS'] },
  { id: 2, name: 'Alice Smith', email: 'alice@example.com', score: 92, status: 'Shortlisted', skills: ['React', 'Node.js', 'TypeScript'] },
  { id: 3, name: 'Ethan Garcia', email: 'ethan@example.com', score: 65, status: 'Rejected', skills: ['Go', 'Kubernetes', 'Docker'] },
];

const MOCK_INTERVIEWS = [
  { id: 'int_123', candidateName: 'Diana Evans', date: 'Oct 24, 2026 - 10:00 AM', status: 'Scheduled', link: '/interview/int_123' },
];

export default function CandidateDashboard() {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);

  const scheduleInterview = (candidate: typeof MOCK_CANDIDATES[0]) => {
    // Generate a mock unique interview ID
    const interviewId = `int_${Math.floor(Math.random() * 10000)}`;
    
    // Update local state to show it scheduled
    setInterviews([
      ...interviews,
      {
        id: interviewId,
        candidateName: candidate.name,
        date: 'Pending candidate confirmation',
        status: 'Scheduled',
        link: `/interview/${interviewId}`
      }
    ]);
    
    // Update candidate status
    setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, status: 'Interviewing' } : c));
    
    alert(`Interview link generated and emailed to ${candidate.name}!`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-8 animate-fade-in pb-20">
      


      {/* Filters (Multi-Tenancy Demonstration) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company</label>
            <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-48 p-2 cursor-pointer">
              <option>Acme Corp</option>
              <option>TechNova Inc.</option>
              <option>Global Industries</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Role</label>
            <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-48 p-2 cursor-pointer">
              <option>Senior React Developer</option>
              <option>Backend Go Engineer</option>
              <option>Product Manager</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-slate-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-md font-medium border border-blue-100 dark:border-blue-800/50">
          Showing results for: <strong>Acme Corp</strong> - Senior React Developer
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Shortlisted Candidates (Vector DB Results) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">AI Shortlisted Candidates</h2>
          
          <div className="space-y-4">
            {candidates.map(candidate => (
              <div key={candidate.id} className="bg-slate-50 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{candidate.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      candidate.score >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {candidate.score}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{candidate.skills.join(', ')}</p>
                  <span className="text-xs text-slate-400 mt-2 block">Status: {candidate.status}</span>
                </div>
                
                <button 
                  onClick={() => scheduleInterview(candidate)}
                  disabled={candidate.status === 'Interviewing' || candidate.status === 'Rejected'}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-md text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  Schedule
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Interviews */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Scheduled Interviews</h2>
          
          <div className="space-y-4">
            {interviews.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No interviews scheduled yet.</p>
            ) : (
              interviews.map(interview => (
                <div key={interview.id} className="bg-slate-50 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{interview.candidateName}</h3>
                      <p className="text-xs text-slate-500">{interview.date}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {interview.status}
                    </span>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-sm">
                    <code className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                      {interview.link}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`http://localhost:5173${interview.link}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
