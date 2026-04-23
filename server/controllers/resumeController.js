const pdfParse = require('pdf-parse');
const { analyzeResume } = require('../utils/resumeAnalyzer');

exports.analyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a PDF resume' });
    }

    const jobDescription = req.body.jobDescription || '';

    // Parse PDF
    let resumeText = "";
    try {
      if (pdfParse && typeof pdfParse.PDFParse === 'function') {
        try {
          // If it's the modern pdf-parse v2.4.5+ class
          const parser = new pdfParse.PDFParse({ data: req.file.buffer });
          if (typeof parser.getText === 'function') {
            const textResult = await parser.getText();
            resumeText = textResult.text || textResult;
          } else if (typeof parser.parseBuffer === 'function') {
            // pdf2json fallback just in case
            await new Promise((resolve, reject) => {
              parser.on("pdfParser_dataError", errData => reject(new Error(errData.parserError)));
              parser.on("pdfParser_dataReady", pdfData => {
                resumeText = parser.getRawTextContent();
                resolve();
              });
              parser.parseBuffer(req.file.buffer);
            });
          } else if (typeof parser.parse === 'function') {
            // pdfparse fallback
            const data = await parser.parse(req.file.buffer);
            resumeText = typeof data === 'string' ? data : (data.text || data.toString());
          } else {
            return res.status(500).json({ msg: "Parse Error: Class has no valid parsing method (getText/parse/parseBuffer)" });
          }
        } catch (classErr) {
          return res.status(500).json({ msg: `Class Init Error: ${classErr.message}` });
        }
      } else if (typeof pdfParse === 'function') {
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } else {
        return res.status(500).json({ msg: `Debug: Cannot parse PDF. Keys: ${Object.keys(pdfParse).join(',')}` });
      }
    } catch (parseErr) {
      return res.status(500).json({ msg: `Parse Error: ${parseErr.message}` });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ msg: 'Could not extract text from PDF' });
    }

    // Analyze
    const analysis = analyzeResume(resumeText, jobDescription);

    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message || 'Server error during resume analysis' });
  }
};
