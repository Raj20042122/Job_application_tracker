const defaultKeywords = require('./keywordList');

const extractKeywords = (text) => {
  const words = text.toLowerCase().replace(/[^\w\s/.-]/g, '').split(/\s+/);
  return words.filter(w => w.length > 2);
};

const analyzeResume = (resumeText, jobDescription) => {
  const text = resumeText.toLowerCase();
  
  let targetKeywords = [];
  if (jobDescription && jobDescription.trim().length > 0) {
    const jdWords = extractKeywords(jobDescription);
    targetKeywords = [...new Set(jdWords)].filter(w => defaultKeywords.includes(w) || w.length > 4);
  } else {
    targetKeywords = defaultKeywords;
  }

  const matchedKeywords = [];
  const missingKeywords = [];
  
  targetKeywords.forEach(kw => {
    if (text.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const displayMissing = missingKeywords.slice(0, 10);
  let keywordMatchPercent = 0;
  if (targetKeywords.length > 0) {
    if (jobDescription && jobDescription.trim().length > 0) {
      keywordMatchPercent = Math.min(100, Math.round((matchedKeywords.length / targetKeywords.length) * 100));
    } else {
      keywordMatchPercent = Math.min(100, Math.round((matchedKeywords.length / 10) * 100));
    }
  }

  const sections = {
    contact: /(email|phone|linkedin\.com|github\.com)/i.test(resumeText),
    summary: /(summary|objective|about me|profile)/i.test(resumeText),
    skills: /(skills|technologies|tools|tech stack)/i.test(resumeText),
    experience: /(experience|work history|employment|professional experience)/i.test(resumeText),
    education: /(education|degree|university|college|bachelor|master)/i.test(resumeText),
    projects: /(projects|portfolio|case studies)/i.test(resumeText),
    certifications: /(certifications|courses|certificates)/i.test(resumeText)
  };

  const sectionsPresent = Object.values(sections).filter(Boolean).length;
  const sectionsScore = (sectionsPresent / 7) * 100;

  const words = resumeText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  let wordCountLabel = "Ideal";
  let wordCountScore = 100;
  if (wordCount < 200) {
    wordCountLabel = "Too Short";
    wordCountScore = 50;
  } else if (wordCount > 700) {
    wordCountLabel = "Too Long";
    wordCountScore = 70;
  }

  const bulletPoints = (resumeText.match(/^[•\-\*]/gm) || []).length;
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(resumeText);
  const hasLinks = /(https?:\/\/|www\.)[^\s]+/.test(resumeText) || /linkedin\.com|github\.com/.test(resumeText);

  let formattingScore = wordCountScore * 0.4 + (bulletPoints >= 5 ? 100 : bulletPoints * 20) * 0.3 + (hasEmail ? 10 : 0) + (hasPhone ? 10 : 0) + (hasLinks ? 10 : 0);
  formattingScore = Math.min(100, formattingScore);

  const totalScore = Math.round((keywordMatchPercent * 0.50) + (sectionsScore * 0.30) + (formattingScore * 0.20));

  let grade = "D";
  let gradeLabel = "Major revision required";
  if (totalScore >= 90) {
    grade = "A";
    gradeLabel = "ATS Optimized";
  } else if (totalScore >= 75) {
    grade = "B";
    gradeLabel = "Good, minor fixes needed";
  } else if (totalScore >= 60) {
    grade = "C";
    gradeLabel = "Needs improvement";
  }

  const issues = [];
  const suggestions = [];

  if (!sections.summary) {
    issues.push("Missing Summary section");
    suggestions.push({ priority: "high", text: "Add a professional summary tailored to the job" });
  }
  if (!sections.experience) {
    issues.push("Missing Experience section");
    suggestions.push({ priority: "high", text: "Ensure your work experience is clearly labeled" });
  }
  if (!sections.certifications) {
    issues.push("Missing Certifications section");
    suggestions.push({ priority: "medium", text: "Add a certifications section to boost credibility" });
  }
  if (keywordMatchPercent < 50) {
    issues.push("Low keyword match for target role");
    const kws = displayMissing.slice(0, 3).join(", ");
    if(kws) {
        suggestions.push({ priority: "high", text: `Add missing keywords: ${kws}` });
    } else {
        suggestions.push({ priority: "high", text: `Add relevant tech keywords` });
    }
  }
  if (wordCountLabel === "Too Short") {
    issues.push("Resume is too short");
    suggestions.push({ priority: "medium", text: "Expand on your experience and projects to hit 300+ words" });
  }
  if (bulletPoints < 5) {
    issues.push("Not enough bullet points");
    suggestions.push({ priority: "medium", text: "Use bullet points to make your experience easy to scan" });
  }
  if (!/(achieved|improved|increased|optimized|led|built|developed|created)/i.test(resumeText)) {
    suggestions.push({ priority: "low", text: "Use strong action verbs: built, optimized, led" });
  }
  if (!/\d+%|\d+x|\$\d+/.test(resumeText)) {
    suggestions.push({ priority: "medium", text: "Quantify achievements with numbers and impact (e.g., increased by 20%)" });
  }

  return {
    score: totalScore,
    grade,
    gradeLabel,
    keywordMatch: keywordMatchPercent,
    matchedKeywords: [...new Set(matchedKeywords)].slice(0, 15),
    missingKeywords: displayMissing,
    sections,
    formatting: {
      wordCount,
      wordCountLabel,
      bulletPoints,
      hasEmail,
      hasPhone,
      hasLinks
    },
    issues,
    suggestions
  };
};

module.exports = { analyzeResume };
