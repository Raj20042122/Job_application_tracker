import React, { useEffect, useState } from 'react';

const ScoreRing = ({ score, grade, gradeLabel }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(score, 10);
    if (start === end) return;
    
    let totalDuration = 1200;
    let incrementTime = (totalDuration / end);
    
    let timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let colorClass = "text-red-500";
  if (grade === "A") colorClass = "text-green-500";
  else if (grade === "B") colorClass = "text-indigo-500";
  else if (grade === "C") colorClass = "text-yellow-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center mb-4">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            className="text-slate-200 dark:text-slate-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          <circle
            className={`${colorClass} transition-all duration-[1.2s] ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colorClass}`}>{animatedScore}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ 100</span>
        </div>
      </div>
      <div className={`px-4 py-1.5 rounded-full text-sm font-bold border mb-2 ${
          grade === 'A' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
          grade === 'B' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800' :
          grade === 'C' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
          'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
      }`}>
        Grade {grade}
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium text-center">{gradeLabel}</p>
    </div>
  );
};

export default ScoreRing;
