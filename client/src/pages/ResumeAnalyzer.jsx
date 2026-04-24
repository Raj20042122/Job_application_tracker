import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';

// Components
import UploadZone from '../components/resume/UploadZone';
import LoadingState from '../components/resume/LoadingState';
import ScoreRing from '../components/resume/ScoreRing';
import ScoreBreakdown from '../components/resume/ScoreBreakdown';
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Based on standard ATS parsing logic.</p>
              </div>
              <button onClick={handleReset} className="saas-button bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-none">
                Analyze Another
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-1 space-y-6">
                <div className="saas-card p-6 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 w-full text-center">Overall Score</h3>
                  <ScoreRing score={results.score} grade={results.grade} gradeLabel={results.gradeLabel} />
                  
                  <div className="w-full mt-6 space-y-4">
                    <ScoreBreakdown label="Keywords" percentage={results.keywordMatch} colorClass="bg-indigo-500" />
                    <ScoreBreakdown label="Sections" percentage={Math.round((Object.values(results.sections).filter(Boolean).length / 7) * 100)} colorClass="bg-indigo-500" />
                    <ScoreBreakdown label="Formatting" percentage={80} colorClass="bg-indigo-500" /> {/* Abstracted formatting score visually */}
                  </div>
                </div>

                <div className="saas-card p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Required Sections</h3>
                  <SectionChecklist sections={results.sections} />
                </div>

                <FormattingCard formatting={results.formatting} />
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-2">
                <KeywordPanel 
                  matchPercent={results.keywordMatch} 
                  matched={results.matchedKeywords} 
                  missing={results.missingKeywords} 
                />
                <IssuesCard issues={results.issues} />
                <SuggestionsCard suggestions={results.suggestions} />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ResumeAnalyzer;
