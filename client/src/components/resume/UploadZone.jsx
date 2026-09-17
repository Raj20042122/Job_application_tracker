import React from "react";
import { UploadCloud, FileText, Sparkles } from "lucide-react";

const UploadZone = ({ onFileSelect, jobDescription, setJobDescription, onAnalyze, file }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      onFileSelect(droppedFile);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">
          ATS Resume Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload your resume to get keyword analysis, section compliance, and ATS scoring.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer relative ${
          file
            ? "border-indigo-500/50 bg-indigo-500/5"
            : "border-white/[0.1] bg-[#0C101A] hover:border-indigo-500/40 hover:bg-white/[0.02]"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload Resume PDF"
        />
        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            {file ? <FileText size={26} /> : <UploadCloud size={26} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {file ? file.name : "Drop your PDF resume here or click to browse"}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF format only • Max 5MB</p>
          </div>
        </div>
      </div>

      {/* Optional Job Description */}
      <div className="jt-card p-5">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
          Target Job Description (Optional for Keyword Match)
        </label>
        <textarea
          rows={4}
          className="jt-input resize-none text-xs leading-relaxed"
          placeholder="Paste the job requirements to match critical ATS keywords and skills..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onAnalyze}
        disabled={!file}
        className="jt-btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Sparkles size={16} />
        <span>Analyze Resume with ATS Scanner</span>
      </button>
    </div>
  );
};

export default UploadZone;
