import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';

// Components
import UploadZone from '../components/resume/UploadZone';
import LoadingState from '../components/resume/LoadingState';
import SectionChecklist from '../components/resume/SectionChecklist';
import KeywordPanel from '../components/resume/KeywordPanel';
import FormattingCard from '../components/resume/FormattingCard';
import IssuesCard from '../components/resume/IssuesCard';
import SuggestionsCard from '../components/resume/SuggestionsCard';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, results
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }

    setStatus("loading");
    
    const formData = new FormData();
    formData.append("resume", file);
    if (jobDescription) {
      formData.append("jobDescription", jobDescription);
    }

    try {
      const res = await API.post('/resume/analyze', formData);
      setResults(res.data);
      // Small artificial delay to let user read the final tip
      setTimeout(() => setStatus("results"), 800);
    } catch (err) {
      setStatus("idle");
      toast.error(err.response?.data?.msg || "Failed to analyze resume");
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setResults(null);
    setStatus("idle");
  };

  return (
    <div className="w-full h-full">
      <main className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 animate-in fade-in duration-500 ${status === 'idle' ? 'min-h-[calc(100vh-140px)] flex flex-col justify-center' : ''}`}>
        
        {status === 'idle' && (
          <div className="w-full pb-10">
            <UploadZone 
              onFileSelect={setFile} 
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              onAnalyze={handleAnalyze}
              file={file}
            />
          </div>
        )}

        {status === 'loading' && (
          <LoadingState />
        )}

        {status === 'results' && results && (
          <div className="animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#f1f5f9]">Analysis Results</h2>
                <p className="text-[#94a3b8] text-sm mt-1">Based on standard ATS parsing logic.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleReset} className="bg-transparent border border-[#334155] text-[#f1f5f9] hover:bg-[#334155]/50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
                  Analyze Another
                </button>
                <button className="bg-[#6366f1] text-white hover:bg-[#4f46e5] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-[#6366f1]/20">
                  + Add Application
                </button>
              </div>
            </div>

            {/* TOP 4 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Overall Score */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full border-4 border-[#22c55e] flex items-center justify-center relative shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#f1f5f9] mb-1">Overall Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#22c55e] leading-none">{results.score}</span>
                    <span className="text-[13px] text-[#94a3b8] font-medium">/100</span>
                  </div>
                </div>
              </div>

              {/* Keyword Match */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#6366f1]/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#f1f5f9] mb-1">Keyword Match</span>
                  <span className="text-2xl font-bold text-[#6366f1] leading-none mb-1">{results.keywordMatch}%</span>
                  <span className="text-[11px] font-medium text-[#22c55e]">Matched: {results.matchedKeywords.length} <span className="text-[#94a3b8] px-1">•</span> <span className="text-[#ef4444]">Missing: {results.missingKeywords.length}</span></span>
                </div>
              </div>

              {/* Sections */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#f1f5f9] mb-1">Sections</span>
                  <span className="text-2xl font-bold text-[#f1f5f9] leading-none mb-1">{Math.round((Object.values(results.sections).filter(Boolean).length / 7) * 100)}%</span>
                  <span className="text-[11px] font-medium text-[#22c55e]">Good</span>
                </div>
              </div>

              {/* Formatting */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#f1f5f9] mb-1">Formatting</span>
                  <span className="text-2xl font-bold text-[#f1f5f9] leading-none mb-1">87%</span>
                  <span className="text-[11px] font-medium text-[#3b82f6]">Well Structured</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-4">
                <KeywordPanel 
                  matchPercent={results.keywordMatch} 
                  matched={results.matchedKeywords} 
                  missing={results.missingKeywords} 
                />
                <IssuesCard issues={results.issues} />
                <SuggestionsCard suggestions={results.suggestions} />
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-1">
                <SectionChecklist sections={results.sections} />
                <FormattingCard formatting={results.formatting} />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ResumeAnalyzer;
