import React from 'react';
import { UploadCloud } from 'lucide-react';

const UploadZone = ({ onFileSelect, jobDescription, setJobDescription, onAnalyze, file }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onFileSelect(droppedFile);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Resume Analyzer</h1>
        <p className="text-base text-slate-500 dark:text-slate-400">Upload your resume to get an instant ATS compatibility score and actionable feedback.</p>
      </div>

      <div 
        onDragOver={(e) => e.preventDefault()} 
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer relative"
      >
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload Resume PDF"
        />
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
            <UploadCloud size={32} />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              {file ? file.name : "Drop your resume here or click to browse"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PDF format only • Max 5MB</p>
          </div>
        </div>
      </div>

      <div className="saas-card p-5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Target Job Description (Optional)
        </label>
        <textarea
          rows={4}
          className="saas-input resize-none py-3 text-base"
          placeholder="Paste the job description here to check for missing keywords..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <button
        onClick={onAnalyze}
        disabled={!file}
        className="w-full saas-button py-4 text-lg font-semibold"
      >
        Analyze Resume
      </button>
    </div>
  );
};

export default UploadZone;
