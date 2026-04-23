import React, { useState, useEffect } from 'react';

const LoadingState = () => {
  const tips = [
    "Scanning resume sections...",
    "Matching keywords...",
    "Calculating ATS score...",
    "Generating suggestions..."
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-20 h-20 mb-8">
        <svg className="animate-spin w-full h-full text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
        </svg>
      </div>
      <div className="h-8 overflow-hidden relative w-64 text-center">
        {tips.map((tip, index) => (
          <p
            key={index}
            className={`absolute w-full top-0 text-lg font-medium text-slate-600 dark:text-slate-300 transition-all duration-500 ${
              index === currentTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {tip}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
