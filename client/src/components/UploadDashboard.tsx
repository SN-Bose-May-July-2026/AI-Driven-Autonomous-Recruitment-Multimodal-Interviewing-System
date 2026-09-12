import { useState } from 'react';

export default function UploadDashboard() {
  const [jdText, setJdText] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [resumeFiles, setResumeFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleUpload = async () => {
    if (!resumeFiles || !jdText) {
      alert("Please provide the Job Description and the candidate resumes.");
      return;
    }

    setStatus('uploading');
    const formData = new FormData();
    formData.append('jdText', jdText);
    if (csvFile) formData.append('csvData', csvFile);
    
    for (let i = 0; i < resumeFiles.length; i++) {
      formData.append('resumes', resumeFiles[i]);
    }

    try {
      // Mocking the request for the UI demonstration
      setTimeout(() => setStatus('success'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 max-w-2xl mx-auto space-y-6 shadow-sm mt-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Bulk Ingestion Dashboard (100+ Candidates)</h2>
      <p className="text-sm text-slate-500">To upload 100+ candidates reliably, provide a CSV file mapping candidate details to their resume filenames, along with the bulk resumes.</p>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">1. Target Job Description</label>
        <textarea 
          className="w-full h-24 p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-900 dark:text-white"
          placeholder="Paste the target job description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">2. Candidate Data (CSV)</label>
          <p className="text-xs text-slate-400 mb-2">Columns: Name, Email, Phone, ResumeFilename</p>
          <input 
            type="file" 
            accept=".csv"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-slate-200 cursor-pointer"
            onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">3. Resumes (PDFs or ZIP)</label>
          <p className="text-xs text-slate-400 mb-2">Select 100+ PDFs or upload a single ZIP archive.</p>
          <input 
            type="file" 
            multiple 
            accept=".pdf,.zip"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-slate-200 cursor-pointer"
            onChange={(e) => setResumeFiles(e.target.files)}
          />
        </div>
      </div>

      <button 
        onClick={handleUpload}
        disabled={status === 'uploading'}
        className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4"
      >
        {status === 'uploading' ? 'Queuing 100+ Candidates...' : 'Upload & Start Background Processing'}
      </button>

      {status === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800/50">
          <p className="text-green-700 dark:text-green-400 text-center font-medium text-sm">
            ✅ Successfully queued! The background workers are now parsing the resumes and mapping them to the CSV data.
          </p>
        </div>
      )}
    </div>
  );
}
