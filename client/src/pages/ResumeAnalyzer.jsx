import React, { useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";

import UploadZone from "../components/resume/UploadZone";
import LoadingState from "../components/resume/LoadingState";
import SectionChecklist from "../components/resume/SectionChecklist";
import KeywordPanel from "../components/resume/KeywordPanel";
import FormattingCard from "../components/resume/FormattingCard";
import IssuesCard from "../components/resume/IssuesCard";
import SuggestionsCard from "../components/resume/SuggestionsCard";
import { RotateCcw, Plus, CheckCircle2, AlertTriangle, Award, FileText } from "lucide-react";
import AddEditJobModal from "../components/AddEditJobModal";

const ResumeAnalyzer = () => {
  const { onOpenAddJob } = useOutletContext() || {};
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, results
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const res = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResults(res.data);
      setTimeout(() => setStatus("results"), 600);
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

  const handleSaveJobFromAnalysis = async (jobData) => {
    try {
      await api.post("/jobs", jobData);
      toast.success("Job application created from analysis!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to create application");
    }
  };

  return (
    <div className="w-full pb-12">
      {status === "idle" && (
        <div className="py-6">
          <UploadZone
            onFileSelect={setFile}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onAnalyze={handleAnalyze}
            file={file}
          />
        </div>
      )}

      {status === "loading" && <LoadingState />}

      {status === "results" && results && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Resume ATS Diagnostic Report
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Automated parsing results and algorithmic recommendations
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleReset}
                className="jt-btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Analyze Another</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="jt-btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Create Job with this Spec</span>
              </button>
            </div>
          </div>

          {/* Top Score Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Score */}
            <div className="jt-card p-5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Overall ATS Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  {results.score || 0}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {results.score >= 80 ? "Excellent ATS readiness" : results.score >= 60 ? "Good, minor optimizations needed" : "Needs keyword & formatting fixes"}
              </p>
            </div>

            {/* Keyword Match */}
            <div className="jt-card p-5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Keyword Match
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
                  {results.keywordMatchPercent || 0}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {results.matchedKeywords?.length || 0} relevant terms identified
              </p>
            </div>

            {/* Sections Passed */}
            <div className="jt-card p-5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Standard Sections
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {results.sectionsPresent || 0}
                </span>
                <span className="text-xs text-slate-500">/ 7 checked</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Core resume components found</p>
            </div>

            {/* Word Count */}
            <div className="jt-card p-5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Word Count Length
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {results.wordCount || 0}
                </span>
                <span className="text-xs text-indigo-400 font-semibold">({results.wordCountLabel})</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Ideal range: 350 - 650 words</p>
            </div>
          </div>

          {/* Section Breakdown & Keywords */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <div className="jt-card p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                  Standard ATS Sections Check
                </h3>
                <SectionChecklist sections={results.sections || {}} />
              </div>

              <div className="jt-card p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                  Formatting & Structure
                </h3>
                <FormattingCard formatting={results.formatting || {}} />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="jt-card p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                  Target Keyword Matching
                </h3>
                <KeywordPanel
                  matched={results.matchedKeywords || []}
                  missing={results.missingKeywords || []}
                />
              </div>

              <div className="jt-card p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                  Actionable Suggestions
                </h3>
                <SuggestionsCard suggestions={results.suggestions || []} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal prepopulated with parsed JD */}
      <AddEditJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          notes: jobDescription ? `Job Description applied:\n${jobDescription.substring(0, 300)}...` : ""
        }}
        onSave={handleSaveJobFromAnalysis}
      />
    </div>
  );
};

export default ResumeAnalyzer;
